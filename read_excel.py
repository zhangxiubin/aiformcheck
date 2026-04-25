# -*- coding: utf-8 -*-
"""
读取并解析 Excel 模板文件
"""
import sys
import xlrd
import json

def read_excel_file(file_path):
    """读取 Excel 文件并返回所有工作表的数据"""
    try:
        workbook = xlrd.open_workbook(file_path, formatting_info=False, on_demand=True)
        sheet_names = workbook.sheet_names()

        print(f"Excel 文件包含 {len(sheet_names)} 个工作表:")
        for idx, name in enumerate(sheet_names):
            print(f"  {idx + 1}. {name}")

        # 读取所有工作表
        all_data = {}
        for sheet_name in sheet_names:
            sheet = workbook.sheet_by_name(sheet_name)
            data = {
                'name': sheet_name,
                'nrows': sheet.nrows,
                'ncols': sheet.ncols,
                'rows': []
            }

            # 读取前 20 行数据用于分析
            max_rows = min(50, sheet.nrows)
            for row_idx in range(max_rows):
                row_data = []
                for col_idx in range(sheet.ncols):
                    try:
                        cell_value = sheet.cell_value(row_idx, col_idx)
                        # 处理不同类型的单元格
                        if cell_value == '':
                            cell_value = None
                        row_data.append(cell_value)
                    except:
                        row_data.append(None)
                data['rows'].append(row_data)

            all_data[sheet_name] = data

        workbook.release_resources()
        return all_data

    except Exception as e:
        print(f"读取 Excel 文件出错: {str(e)}")
        return None

def analyze_structure(all_data):
    """分析 Excel 文件的结构"""
    print("\n" + "="*80)
    print("Excel 文件结构分析")
    print("="*80)

    for sheet_name, sheet_data in all_data.items():
        print(f"\n【工作表: {sheet_name}】")
        print(f"行数: {sheet_data['nrows']}, 列数: {sheet_data['ncols']}")

        # 显示前 10 行数据
        print("\n前 10 行数据:")
        for idx, row in enumerate(sheet_data['rows'][:10]):
            # 过滤空行
            if any(cell is not None and str(cell).strip() for cell in row):
                print(f"  第 {idx + 1} 行: {row[:sheet_data['ncols']]}")

if __name__ == "__main__":
    excel_file = r"Template\临床科室医疗质量考核评分标准.xls"

    print(f"正在读取文件: {excel_file}")
    all_data = read_excel_file(excel_file)

    if all_data:
        analyze_structure(all_data)

        # 保存为 JSON 用于后续分析
        output_file = "output/excel_analysis.json"
        import os
        os.makedirs("output", exist_ok=True)

        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(all_data, f, ensure_ascii=False, indent=2)

        print(f"\n分析结果已保存到: {output_file}")
