#!/usr/bin/env python3
"""
Replace all hasOwnProperty checks with 'in' operator for cleaner code.
"""

import re
import glob

def replace_has_own_property(content):
    """Replace hasOwnProperty with 'in' operator."""

    # Pattern 1: Fix already broken patterns like: props.'content' in element
    # Back to: 'content' in props.element
    pattern_fix = r"(\w+)\.'(\w+)' in (\w+)"
    replacement_fix = r"'\2' in \1.\3"
    content = re.sub(pattern_fix, replacement_fix, content)

    # Pattern 2: obj.hasOwnProperty('prop') -> 'prop' in obj
    # Handles: element.hasOwnProperty('step'), props.element.hasOwnProperty('content')
    pattern1 = r'([\w.]+)\.hasOwnProperty\(["\'](\w+)["\']\)'
    replacement1 = r"'\2' in \1"
    content = re.sub(pattern1, replacement1, content)

    # Pattern 3: !obj.hasOwnProperty('prop') -> !('prop' in obj)
    pattern2 = r"!('(\w+)' in ([\w.]+))"
    replacement2 = r"!('\2' in \3)"
    content = re.sub(pattern2, replacement2, content)

    # Pattern 4: obj.hasOwnProperty(`formField${var}`) -> `formField${var}` in obj
    pattern3 = r'([\w.]+)\.hasOwnProperty\(`([^`]+)`\)'
    replacement3 = r'`\2` in \1'
    content = re.sub(pattern3, replacement3, content)

    return content


def process_file(filepath):
    """Process a single file."""
    print(f"Processing: {filepath}")

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    content = replace_has_own_property(content)

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  ✅ Updated {filepath}")
        return True
    else:
        print(f"  ⏭️  No changes needed")
        return False

def main():
    """Process all relevant files."""
    files = [
        'src/form-elements-edit.jsx',
        *glob.glob('src/form-elements-edit/*.jsx')
    ]

    updated_count = 0
    for filepath in files:
        if process_file(filepath):
            updated_count += 1

    print(f"\n✅ Complete! Updated {updated_count} file(s)")
    print("All hasOwnProperty checks replaced with 'in' operator")

if __name__ == '__main__':
    main()
