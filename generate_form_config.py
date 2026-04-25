# -*- coding: utf-8 -*-
"""
根据 Excel 数据生成 CustomForm 规范的 JSON 配置文件
"""
import json
import hashlib
import re
from datetime import datetime

def generate_id(content):
    """根据内容生成唯一ID"""
    if content is None:
        content = ""
    # 使用 MD5 生成短ID
    md5_hash = hashlib.md5(str(content).encode('utf-8')).hexdigest()[:7]
    return f"id_{md5_hash}"

def generate_field_name(text):
    """将中文文本转换为字段名"""
    if text is None:
        return "field_unknown"

    # 移除特殊字符，只保留中文、英文、数字
    text = re.sub(r'[^一-龥a-zA-Z0-9]', '_', text)

    # 如果过长，截取前20个字符
    if len(text) > 20:
        text = text[:20]

    return f"field_{text}"

def clean_text(text):
    """清理文本内容"""
    if text is None:
        return ""
    return str(text).strip()

def create_form_item(row_data, row_idx):
    """根据Excel行数据创建表单项配置"""

    # 解析Excel行数据
    # 列结构: [类别, 项目, 检查要求, 评分标准, 标分, 得分, 扣分理由, 考核部门]
    category = clean_text(row_data[0]) if len(row_data) > 0 else ""
    project = clean_text(row_data[1]) if len(row_data) > 1 else ""
    requirement = clean_text(row_data[2]) if len(row_data) > 2 else ""
    score_standard = clean_text(row_data[3]) if len(row_data) > 3 else ""
    standard_score = row_data[4] if len(row_data) > 4 else None
    score = row_data[5] if len(row_data) > 5 else None
    deduct_reason = row_data[6] if len(row_data) > 6 else ""
    department = clean_text(row_data[7]) if len(row_data) > 7 else ""

    items = []

    # 如果有类别，创建分组标题（使用文本展示或分割线）
    if category and category != "项目":
        items.append({
            "id": generate_id(f"{category}_{row_idx}_group"),
            "field": generate_field_name(f"{category}_group"),
            "type": "text",
            "notBindToModel": True,
            "formItemProps": {
                "label": ""
            },
            "colProps": {
                "span": 24
            },
            "defaultValue": f"【{category}】",
            "valueType": "string",
            "styles": "font-weight: bold; font-size: 16px; margin: 10px 0; color: #409EFF;"
        })

    # 项目名称（文本展示）
    if project:
        items.append({
            "id": generate_id(f"{project}_{row_idx}_name"),
            "field": generate_field_name(f"{project}_name"),
            "type": "text",
            "notBindToModel": True,
            "formItemProps": {
                "label": "项目名称"
            },
            "colProps": {
                "span": 24
            },
            "defaultValue": project,
            "valueType": "string"
        })

    # 检查要求（文本展示）
    if requirement and requirement != "检  查  要  求":
        items.append({
            "id": generate_id(f"{project}_{row_idx}_requirement"),
            "field": generate_field_name(f"{project}_requirement"),
            "type": "text",
            "notBindToModel": True,
            "formItemProps": {
                "label": "检查要求"
            },
            "colProps": {
                "span": 24
            },
            "defaultValue": requirement,
            "valueType": "string",
            "styles": "color: #606266; line-height: 1.6;"
        })

    # 评分标准（文本展示）
    if score_standard and score_standard != "评  分  标  准":
        items.append({
            "id": generate_id(f"{project}_{row_idx}_standard"),
            "field": generate_field_name(f"{project}_standard"),
            "type": "text",
            "notBindToModel": True,
            "formItemProps": {
                "label": "评分标准"
            },
            "colProps": {
                "span": 24
            },
            "defaultValue": score_standard,
            "valueType": "string",
            "styles": "color: #909399; font-size: 12px;"
        })

    # 标分、得分、扣分理由（输入字段）
    if standard_score is not None and str(standard_score) != "":
        items.append({
            "id": generate_id(f"{project}_{row_idx}_standard_score"),
            "field": generate_field_name(f"{project}_standard_score"),
            "type": "inputNumber",
            "formItemProps": {
                "label": "标分"
            },
            "colProps": {
                "span": 6
            },
            "defaultValue": float(standard_score) if standard_score else 0,
            "valueType": "number",
            "formItemEntityProps": json.dumps({
                "disabled": True,
                "precision": 1,
                "step": 0.5
            }, ensure_ascii=False)
        })

        items.append({
            "id": generate_id(f"{project}_{row_idx}_score"),
            "field": generate_field_name(f"{project}_score"),
            "type": "inputNumber",
            "formItemProps": {
                "label": "得分"
            },
            "colProps": {
                "span": 6
            },
            "defaultValue": 0,
            "valueType": "number",
            "formItemEntityProps": json.dumps({
                "precision": 1,
                "step": 0.5,
                "min": 0,
                "max": float(standard_score) if standard_score else 10
            }, ensure_ascii=False),
            "validateRulesRequired": json.dumps({
                "required": False,
                "message": "请输入得分"
            }, ensure_ascii=False)
        })

    # 扣分理由
    items.append({
        "id": generate_id(f"{project}_{row_idx}_deduct"),
        "field": generate_field_name(f"{project}_deduct"),
        "type": "input",
        "formItemProps": {
            "label": "扣分理由"
        },
        "colProps": {
            "span": 12
        },
        "defaultValue": "",
        "valueType": "string",
        "formItemEntityProps": json.dumps({
            "type": "textarea",
            "rows": 2,
            "placeholder": "请输入扣分理由"
        }, ensure_ascii=False)
    })

    # 考核部门（下拉选择或文本展示）
    if department and department != "考核部门":
        # 提取部门列表
        departments = [d.strip() for d in department.split('\n') if d.strip()]

        if len(departments) > 1:
            # 多个部门，使用下拉选择
            options = [{"text": d, "value": d} for d in departments]
            items.append({
                "id": generate_id(f"{project}_{row_idx}_department"),
                "field": generate_field_name(f"{project}_department"),
                "type": "select",
                "formItemProps": {
                    "label": "考核部门"
                },
                "colProps": {
                    "span": 12
                },
                "defaultValue": departments[0],
                "valueType": "string",
                "dataOrigin": "static",
                "staticData": json.dumps(options, ensure_ascii=False),
                "formItemEntityProps": json.dumps({
                    "placeholder": "请选择考核部门"
                }, ensure_ascii=False)
            })
        else:
            # 单个部门，文本展示
            items.append({
                "id": generate_id(f"{project}_{row_idx}_department"),
                "field": generate_field_name(f"{project}_department"),
                "type": "text",
                "notBindToModel": True,
                "formItemProps": {
                    "label": "考核部门"
                },
                "colProps": {
                    "span": 12
                },
                "defaultValue": department,
                "valueType": "string"
            })

    # 添加分割线
    items.append({
        "id": generate_id(f"{project}_{row_idx}_divider"),
        "field": generate_field_name(f"{project}_divider"),
        "type": "divider",
        "notBindToModel": True,
        "formItemProps": {
            "label": ""
        },
        "colProps": {
            "span": 24
        }
    })

    return items

def generate_form_config(excel_data):
    """生成完整的表单配置"""

    # 获取工作表数据
    sheet_name = list(excel_data.keys())[0]
    sheet_data = excel_data[sheet_name]
    rows = sheet_data['rows']

    # 过滤掉表头行（第1行是表头）
    data_rows = rows[1:]

    # 生成表单项
    all_items = []
    for idx, row in enumerate(data_rows):
        # 跳过完全空白的行
        if all(cell is None or str(cell).strip() == "" for cell in row):
            continue

        # 跳过表头行
        if idx == 0:
            continue

        try:
            items = create_form_item(row, idx)
            all_items.extend(items)
        except Exception as e:
            print(f"处理第 {idx + 1} 行时出错: {str(e)}")
            continue

    # 创建表单配置
    form_config = {
        "name": "临床科室医疗质量考核评分标准",
        "formProps": {
            "labelPosition": "right",
            "labelWidth": "auto",
            "size": "mini",
            "border": False,
            "showMessage": True,
            "fixItemHeight": False,
            "rulesStr": "{}",
            "approvalShowFormMode": "app"
        },
        "rowProps": {
            "gutter": 10
        },
        "items": all_items
    }

    return form_config

def main():
    """主函数"""

    # 读取Excel分析数据
    with open("output/excel_analysis.json", "r", encoding="utf-8") as f:
        excel_data = json.load(f)

    # 生成表单配置
    print("正在生成表单配置...")
    form_config = generate_form_config(excel_data)

    # 保存配置文件
    output_file = "output/临床科室医疗质量考核评分标准.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(form_config, f, ensure_ascii=False, indent=2)

    print(f"\n[SUCCESS] Successfully generated config file: {output_file}")
    print(f"[INFO] Number of form items: {len(form_config['items'])}")
    print(f"[INFO] Form name: {form_config['name']}")

    # Generate statistics
    stats = {
        "total_items": len(form_config["items"]),
        "text_items": sum(1 for item in form_config["items"] if item.get("type") == "text"),
        "input_number_items": sum(1 for item in form_config["items"] if item.get("type") == "inputNumber"),
        "input_items": sum(1 for item in form_config["items"] if item.get("type") == "input"),
        "select_items": sum(1 for item in form_config["items"] if item.get("type") == "select"),
        "divider_items": sum(1 for item in form_config["items"] if item.get("type") == "divider"),
        "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

    print(f"\n[STATISTICS]")
    for key, value in stats.items():
        print(f"   {key}: {value}")

    # Save statistics
    with open("output/generate_stats.json", "w", encoding="utf-8") as f:
        json.dump(stats, f, ensure_ascii=False, indent=2)

    print(f"\n[INFO] Statistics saved to: output/generate_stats.json")

if __name__ == "__main__":
    main()
