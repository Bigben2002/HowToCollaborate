import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { X } from "lucide-react";

interface HelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HelpDialog({ open, onOpenChange }: HelpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md h-[90vh] p-0 gap-0" aria-describedby={undefined}>
        {/* Header */}
        <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
          <DialogTitle className="text-2xl m-0">사용 방법</DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 rounded-full hover:bg-blue-700 active:bg-blue-500 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 h-full">
          <div className="p-6 space-y-6 text-lg">
            <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
              <h3 className="text-xl mb-2">📚 연습 모드</h3>
              <ul className="space-y-2 text-gray-700 ml-4">
                <li>• 화면에 나오는 안내를 따라 하세요</li>
                <li>• 누를 버튼을 표시로 알려드립니다</li>
                <li>• 천천히 따라하며 익숙해지세요</li>
                <li>• 언제든 처음부터 다시 시작 가능</li>
              </ul>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
              <h3 className="text-xl mb-2">⚡ 실전 모드</h3>
              <ul className="space-y-2 text-gray-700 ml-4">
                <li>• 안내 없이 직접 주문해보세요</li>
                <li>• 실제 키오스크처럼 작동합니다</li>
                <li>• 연습 모드로 충분히 배운 후 도전</li>
                <li>• 막히면 뒤로 가기를 눌러주세요</li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200">
              <h3 className="text-xl mb-2">💡 키오스크 사용 팁</h3>
              <ul className="space-y-2 text-gray-700 ml-4">
                <li>• 화면을 손가락으로 가볍게 터치</li>
                <li>• 주문할 메뉴를 차례대로 선택</li>
                <li>• 수량을 조절할 수 있습니다</li>
                <li>• 장바구니에서 주문 확인</li>
                <li>• 결제 버튼으로 주문 완료</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
              <h3 className="text-xl mb-3">❓ 자주 묻는 질문</h3>
              <div className="space-y-4 text-gray-700">
                <div className="border-l-4 border-blue-400 pl-3">
                  <p className="mb-1">Q. 잘못 눌렀어요</p>
                  <p className="text-gray-600">A. 뒤로 가기나 취소 버튼을 누르세요</p>
                </div>
                <div className="border-l-4 border-blue-400 pl-3">
                  <p className="mb-1">Q. 처음부터 다시 하고 싶어요</p>
                  <p className="text-gray-600">A. 처음으로 버튼을 눌러주세요</p>
                </div>
                <div className="border-l-4 border-blue-400 pl-3">
                  <p className="mb-1">Q. 진짜 결제가 되나요?</p>
                  <p className="text-gray-600">A. 아니요, 연습용이라 실제 결제는 안됩니다</p>
                </div>
              </div>
            </div>

            <div className="text-center text-gray-500 text-base pt-4">
              <p>천천히 연습하시면</p>
              <p>금방 익숙해지실 거예요! 💪</p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}