
#!/bin/bash
echo "🔍 开始验证所有导入..."
npx tsc --noEmit --skipLibCheck
if [ $? -eq 0 ]; then
  echo "✅ TypeScript 编译通过！"
else
  echo "❌ TypeScript 编译有错误"
  exit 1
fi
files=(
  "src/App.tsx"
  "src/main.tsx" 
  "src/components/common/Header/Header.tsx"
  "src/components/common/LoadingSpinner/LoadingSpinner.tsx"
  "src/pages/Home/Home.tsx"
  "src/pages/Game/Game.tsx"
)
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "   ✅ $file"
  else
    echo "   ❌ $file 缺失"
  fi
done
find src -name "index.ts" | while read file; do
  if [ -s "$file" ]; then
    echo "   ✅ $file"
  else
    echo "   ❌ $file 为空"
  fi
done
echo "🎉 验证完成！"
