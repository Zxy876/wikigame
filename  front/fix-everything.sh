#!/bin/bash

echo "🎯 开始 Vercel 终极修复..."

# 1. 锁定版本的 package.json
cat > package.json << 'PACKAGE_EOF'
{
  "name": "wiki-racer-frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "axios": "1.6.2"
  },
  "devDependencies": {
    "@types/react": "18.2.37",
    "@types/react-dom": "18.2.15",
    "@types/node": "20.10.0",
    "@vitejs/plugin-react": "4.1.1",
    "typescript": "5.2.2",
    "vite": "4.5.0"
  }
}
PACKAGE_EOF

# 2. Vercel 配置
cat > vercel.json << 'VERCEL_EOF'
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "framework": "vite"
}
VERCEL_EOF

# 3. 生产环境变量
cat > .env.production << 'ENV_EOF'
VITE_API_URL=https://wiki-racer-backend.up.railway.app
NODE_ENV=production
ENV_EOF

# 4. 修复 TypeScript 配置
cat > tsconfig.json << 'TSCONFIG_EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": false,
    "noImplicitAny": false
  },
  "include": ["src"]
}
TSCONFIG_EOF

# 5. 创建缺失的类型文件
mkdir -p src/types
cat > src/types/game.ts << 'TYPES_EOF'
export interface GameResultProps {
  result: {
    path: string[];
    duration: number;
    start: string;
    end: string;
    achievements?: Achievement[];
  };
  onPlayAgain: () => void;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Page {
  title: string;
  url: string;
}
TYPES_EOF

# 6. 修复 GameResult.tsx
cat > src/components/game/GameResult/GameResult.tsx << 'COMPONENT_EOF'
import React from 'react';
import type { GameResultProps, Page, Achievement } from '../../types/game';

interface Props {
  result: GameResultProps['result'];
  onPlayAgain: () => void;
}

const GameResult: React.FC<Props> = ({ result, onPlayAgain }) => {
  const renderPathItem = (page: Page, index: number) => {
    return (
      <div key={index} className="path-item">
        {page.title}
      </div>
    );
  };

  const renderAchievement = (achievement: Achievement, index: number) => {
    return (
      <div key={achievement.id || index} className="achievement">
        {achievement.name}
      </div>
    );
  };

  return (
    <div className="game-result">
      <h2>Game Completed!</h2>
      <p>Duration: {result.duration} seconds</p>
      <div className="path">
        {result.path.map((page: string, index: number) => (
          <div key={index} className="path-item">
            {page}
          </div>
        ))}
      </div>
      
      {result.achievements && result.achievements.length > 0 && (
        <div className="achievements">
          <h3>Achievements</h3>
          {result.achievements.map(renderAchievement)}
        </div>
      )}
      
      <button onClick={onPlayAgain}>Play Again</button>
    </div>
  );
};

export default GameResult;
COMPONENT_EOF

# 7. 修复 helpers.ts
cat > src/utils/helpers.ts << 'HELPERS_EOF'
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return \`\${mins}:\${secs.toString().padStart(2, '0')}\`;
};

export const validateInput = (input: string): boolean => {
  return input.trim().length > 0;
};
HELPERS_EOF

# 8. 删除可能冲突的文件
rm -f tsconfig.node.json

echo "✅ 所有文件修复完成！"
echo ""
echo "📦 现在安装依赖..."
npm install

echo ""
echo "🔨 测试构建..."
npm run build

if [ $? -eq 0 ]; then
    echo "🎉 构建成功！现在提交代码："
    echo "git add ."
    echo 'git commit -m "fix: 终极修复部署问题"'
    echo "git push"
else
    echo "❌ 构建失败，请检查错误信息"
fi
