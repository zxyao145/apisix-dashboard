#!/bin/bash

# Licensed to the Apache Software Foundation (ASF) under one or more
# contributor license agreements.  See the NOTICE file distributed with
# this work for additional information regarding copyright ownership.
# The ASF licenses this file to You under the Apache License, Version 2.0
# (the "License"); you may not use this file except in compliance with
# the License.  You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

echo "🌍 APISIX Dashboard - i18n Validation Script"
echo "=============================================="
echo ""

# Check if messages directory exists
if [ ! -d "messages" ]; then
  echo "❌ Error: messages/ directory not found"
  exit 1
fi

# Validate each JSON file
echo "📝 Validating JSON syntax..."
VALID=true

for file in messages/*.json; do
  if [ -f "$file" ]; then
    echo -n "  Checking $(basename $file)... "
    if node -e "JSON.parse(require('fs').readFileSync('$file', 'utf8'))" 2>/dev/null; then
      echo "✅ Valid"
    else
      echo "❌ Invalid JSON syntax"
      VALID=false
    fi
  fi
done

if [ "$VALID" = false ]; then
  echo ""
  echo "❌ JSON validation failed"
  exit 1
fi

echo ""
echo "🔍 Checking file structure..."

# Check required files
FILES=(
  "i18n/request.ts"
  "i18n/utils.ts"
  "i18n/messages.d.ts"
  "middleware.ts"
  "messages/en-US.json"
  "messages/zh-CN.json"
  "messages/tr-TR.json"
  "components/LocaleSwitcher.tsx"
)

MISSING=false
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file (missing)"
    MISSING=true
  fi
done

if [ "$MISSING" = true ]; then
  echo ""
  echo "❌ Some required files are missing"
  exit 1
fi

echo ""
echo "📊 Translation Statistics:"
for file in messages/*.json; do
  if [ -f "$file" ]; then
    SIZE=$(wc -c < "$file" | awk '{printf "%.1f KB", $1/1024}')
    LINES=$(wc -l < "$file")
    echo "  $(basename $file): $SIZE, $LINES lines"
  fi
done

echo ""
echo "✅ All validations passed!"
echo ""
echo "📚 Documentation:"
echo "  - Full guide: docs/i18n.md"
echo "  - Quick reference: docs/i18n-quick-reference.md"
echo "  - Implementation: docs/I18N-IMPLEMENTATION.md"
echo "  - Messages guide: messages/README.md"
echo ""
echo "🚀 Ready to use!"
