#!/usr/bin/env python3
"""
Update all import paths after project restructure
"""
import os
import re
from pathlib import Path

# Define the import mappings
IMPORT_MAPPINGS = {
    # Utilities
    r"from ['\"]\.\.?/UUID['\"]": "from '../utils/uuid'",
    r"from ['\"]\.\.?/\.\.?/UUID['\"]": "from '../../utils/uuid'",
    r"from ['\"]\.\.?/\.\.?/\.\.?/UUID['\"]": "from '../../../utils/uuid'",
    r"import ID from ['\"]\.\.?/UUID['\"]": "import uuid from '../utils/uuid'",
    r"import ID from ['\"]\.\.?/\.\.?/UUID['\"]": "import uuid from '../../utils/uuid'",
    r"import ID from ['\"]\.\.?/\.\.?/\.\.?/UUID['\"]": "import uuid from '../../../utils/uuid'",

    # ItemTypes
    r"from ['\"]\.\.?/ItemTypes['\"]": "from '../constants/itemTypes'",
    r"from ['\"]\.\.?/\.\.?/ItemTypes['\"]": "from '../../constants/itemTypes'",
    r"from ['\"]\.\.?/\.\.?/\.\.?/ItemTypes['\"]": "from '../../../constants/itemTypes'",

    # Functions folder (now hooks and utils)
    r"from ['\"]\.\.?/functions/useUndoRedo['\"]": "from '../hooks/useUndoRedo'",
    r"from ['\"]\.\.?/\.\.?/functions/useUndoRedo['\"]": "from '../../hooks/useUndoRedo'",
    r"from ['\"]\.\.?/functions/dateUtil['\"]": "from '../utils/dateUtil'",
    r"from ['\"]\.\.?/\.\.?/functions/dateUtil['\"]": "from '../../utils/dateUtil'",
    r"from ['\"]\.\.?/functions/debounce['\"]": "from '../utils/debounce'",
    r"from ['\"]\.\.?/\.\.?/functions/debounce['\"]": "from '../../utils/debounce'",

    # Stores - requests moved to utils
    r"from ['\"]\.\.?/stores/requests['\"]": "from '../utils/requests'",
    r"from ['\"]\.\.?/\.\.?/stores/requests['\"]": "from '../../utils/requests'",

    # XSS utility
    r"from ['\"]\.\.?/myxss['\"]": "from '../utils/xss'",
    r"from ['\"]\.\.?/\.\.?/myxss['\"]": "from '../../utils/xss'",

    # Form elements
    r"from ['\"]\.\.?/form-elements['\"]": "from '../components/form-elements'",
    r"from ['\"]\.\.?/multi-column['\"]": "from '../components/form-elements/layout'",

    # Builder components
    r"from ['\"]\.\.?/toolbar['\"]": "from '../components/builder/Toolbar/Toolbar'",
    r"from ['\"]\.\.?/preview['\"]": "from '../components/builder/Preview/Preview'",
    r"from ['\"]\.\.?/form-elements-edit['\"]": "from '../components/builder/ElementEditor/FormElementsEdit'",

    # Generator components
    r"from ['\"]\.\.?/form['\"]": "from '../components/generator/ReactForm'",
    r"from ['\"]\.\.?/form-validator['\"]": "from '../components/generator/FormValidator'",
}

def update_imports_in_file(filepath):
    """Update imports in a single file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        for pattern, replacement in IMPORT_MAPPINGS.items():
            content = re.sub(pattern, replacement, content)

        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return False

def main():
    src_dir = Path('src')
    files_updated = 0

    # Find all JS/JSX files
    for filepath in src_dir.rglob('*.{js,jsx}'):
        if filepath.name == 'index.js' and 'node_modules' in str(filepath):
            continue

        if update_imports_in_file(filepath):
            print(f"✅ Updated: {filepath}")
            files_updated += 1

    print(f"\n✅ Complete! Updated {files_updated} files")

if __name__ == '__main__':
    main()
