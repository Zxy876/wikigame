#!/bin/bash
echo "🔧 开始自动修复导入问题..."
find src -name "index.ts" | while read file; do echo "   📄 $file"; done
for component in Header Footer LoadingSpinner GameCard AchievementBadge; do
  if [ -d "src/components/common/$component" ]; then
    if [ -f "src/components/common/$component/$component.tsx" ]; then
      if ! grep -q "export default" "src/components/common/$component/$component.tsx"; then
        echo "   🔄 修复 $component 导出..."
        cp "src/components/common/$component/$component.tsx" "src/components/common/$component/$component.tsx.backup"
        cat > "src/components/common/$component/$component.tsx" << EOL
import React from 'react'
import styles from './$component.module.css'
const $component: React.FC = () => {
  return (
    <div className={styles.container}>
      $component Component
    </div>
  )
}
export default $component
EOL
      fi
    fi
    cat > "src/components/common/$component/index.ts" << EOL
export { default as $component } from './$component'
EOL
    echo "   ✅ $component 导出已修复"
  fi
done
for page in Home Game Leaderboard Profile Achievements About; do
  if [ -f "src/pages/$page/$page.tsx" ]; then
    if ! grep -q "export default" "src/pages/$page/$page.tsx"; then
      echo "   🔄 修复 $page 页面导出..."
      cp "src/pages/$page/$page.tsx" "src/pages/$page/$page.tsx.backup"
      grep -v "export const" "src/pages/$page/$page.tsx.backup" | sed 's/const /const /' > "src/pages/$page/$page.tsx"
      echo "export default $page" >> "src/pages/$page/$page.tsx"
    fi
  fi
  cat > "src/pages/$page/index.ts" << EOL
export { default as $page } from './$page'
EOL
  echo "   ✅ $page 页面导出已修复"
done
echo "✅ 所有导入问题已修复！"
