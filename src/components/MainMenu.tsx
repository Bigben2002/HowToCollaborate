import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { HelpCircle, BookOpen, Zap, Menu, BarChart3 } from "lucide-react";

interface MainMenuProps {
  onSelectMode: (mode: 'practice' | 'real') => void;
  onOpenHelp: () => void;
  onOpenHistory: () => void;
}

export function MainMenu({ onSelectMode, onOpenHelp, onOpenHistory }: MainMenuProps) {
  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-blue-600 to-blue-700">
      {/* Android App Bar */}
      <div className="bg-blue-800 shadow-lg">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Menu className="w-6 h-6 text-white" />
            <h1 className="text-xl text-white">키오스크 연습</h1>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={onOpenHistory}
              className="p-2 rounded-full hover:bg-blue-700 active:bg-blue-600 transition-colors"
            >
              <BarChart3 className="w-6 h-6 text-white" />
            </button>
            <button 
              onClick={onOpenHelp}
              className="p-2 rounded-full hover:bg-blue-700 active:bg-blue-600 transition-colors"
            >
              <HelpCircle className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pt-8 pb-6 overflow-y-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-4xl">📱</span>
          </div>
          <h2 className="text-2xl text-white mb-2">키오스크 연습하기</h2>
          <p className="text-lg text-blue-100">천천히 배우고 익숙해지세요</p>
        </div>

        <div className="space-y-4 mb-6">
          {/* Practice Mode Card */}
          <Card 
            className="overflow-hidden shadow-lg border-0 active:scale-[0.98] transition-transform"
            onClick={() => onSelectMode('practice')}
          >
            <div className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl mb-1">연습 모드</h3>
                  <p className="text-blue-50 text-sm">단계별 안내 제공</p>
                </div>
              </div>
              <p className="text-blue-50 mb-4">
                화면에 나오는 안내를 따라하며 천천히 배워보세요
              </p>
              <div className="flex items-center justify-end">
                <span className="text-sm">시작하기 →</span>
              </div>
            </div>
          </Card>

          {/* Real Mode Card */}
          <Card 
            className="overflow-hidden shadow-lg border-0 active:scale-[0.98] transition-transform"
            onClick={() => onSelectMode('real')}
          >
            <div className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Zap className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl mb-1">실전 모드</h3>
                  <p className="text-green-50 text-sm">미션 완수하기</p>
                </div>
              </div>
              <p className="text-green-50 mb-4">
                주어진 미션을 완수하며 실력을 키워보세요
              </p>
              <div className="flex items-center justify-end">
                <span className="text-sm">시작하기 →</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            variant="outline" 
            size="lg"
            className="w-full h-14 text-lg bg-white border-2 border-blue-200 text-blue-700 hover:bg-blue-50 active:bg-blue-100"
            onClick={onOpenHistory}
          >
            <BarChart3 className="w-5 h-5 mr-2" />
            학습 기록 확인
          </Button>

          <Button 
            variant="outline" 
            size="lg"
            className="w-full h-14 text-lg bg-white border-2 border-blue-200 text-blue-700 hover:bg-blue-50 active:bg-blue-100"
            onClick={onOpenHelp}
          >
            <HelpCircle className="w-5 h-5 mr-2" />
            사용 방법 보기
          </Button>
        </div>

        {/* Info Footer */}
        <div className="mt-8 text-center text-blue-100 text-sm">
          <p>실제 결제가 진행되지 않는</p>
          <p>안전한 연습 환경입니다</p>
        </div>
      </div>
    </div>
  );
}