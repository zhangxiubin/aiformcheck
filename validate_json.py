# -*- coding: utf-8 -*-
"""
验证生成的JSON配置文件
"""
import json

def validate_form_config(file_path):
    """验证表单配置的有效性"""

    print(f"正在验证文件: {file_path}\n")

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            config = json.load(f)

        print("[SUCCESS] JSON格式验证通过")

        # 验证必需字段
        required_fields = ['name', 'formProps', 'rowProps', 'items']
        for field in required_fields:
            if field not in config:
                print(f"[ERROR] 缺少必需字段: {field}")
                return False
        print("[SUCCESS] 必需字段验证通过")

        # 验证items
        items = config['items']
        if not isinstance(items, list):
            print("[ERROR] items必须是数组")
            return False
        print(f"[SUCCESS] items数组验证通过，共 {len(items)} 项")

        # 验证每个item的结构
        errors = []
        warnings = []

        for idx, item in enumerate(items):
            if 'id' not in item:
                errors.append(f"第{idx+1}项: 缺少id字段")
            if 'field' not in item:
                errors.append(f"第{idx+1}项: 缺少field字段")
            if 'type' not in item:
                errors.append(f"第{idx+1}项: 缺少type字段")

            # 验证type值
            valid_types = ['text', 'input', 'inputNumber', 'radio', 'checkbox',
                          'select', 'switch', 'table', 'divider', 'empty',
                          'datePicker', 'timePicker', 'slot']
            if 'type' in item and item['type'] not in valid_types:
                warnings.append(f"第{idx+1}项: 未知的type类型 '{item['type']}'")

            # 验证colProps
            if 'colProps' in item and 'span' in item['colProps']:
                span = item['colProps']['span']
                if not isinstance(span, int) or span < 1 or span > 24:
                    warnings.append(f"第{idx+1}项: colProps.span值异常: {span}")

        # 输出验证结果
        if errors:
            print(f"\n[ERRORS] 发现 {len(errors)} 个错误:")
            for error in errors[:10]:  # 只显示前10个
                print(f"  - {error}")
            if len(errors) > 10:
                print(f"  - ... 还有 {len(errors) - 10} 个错误")

        if warnings:
            print(f"\n[WARNINGS] 发现 {len(warnings)} 个警告:")
            for warning in warnings[:10]:  # 只显示前10个
                print(f"  - {warning}")
            if len(warnings) > 10:
                print(f"  - ... 还有 {len(warnings) - 10} 个警告")

        if not errors:
            print(f"\n[SUCCESS] 配置文件验证完全通过!")
            return True
        else:
            print(f"\n[FAILED] 配置文件存在 {len(errors)} 个错误")
            return False

    except json.JSONDecodeError as e:
        print(f"[ERROR] JSON格式错误: {str(e)}")
        return False
    except Exception as e:
        print(f"[ERROR] 验证过程中出错: {str(e)}")
        return False

if __name__ == "__main__":
    file_path = "output/临床科室医疗质量考核评分标准.json"

    result = validate_form_config(file_path)

    if result:
        print(f"\n{'='*60}")
        print(f"[FINAL RESULT] 验证通过: 配置文件符合 CustomForm 规范")
        print(f"{'='*60}")
    else:
        print(f"\n{'='*60}")
        print(f"[FINAL RESULT] 验证失败: 请检查并修复错误")
        print(f"{'='*60}")
