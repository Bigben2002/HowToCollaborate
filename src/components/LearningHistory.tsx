import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { X, Check, XCircle, Trophy, TrendingUp } from "lucide-react";

export interface HistoryRecord {
  id: string;
  date: string;
  mission: string;
  success: boolean;
  userOrder: { name: string; quantity: number }[];
  timestamp: number;
}

interface LearningHistoryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LearningHistory({ open, onOpenChange }: LearningHistoryProps) {
  const getHistory = (): HistoryRecord[] => {
    try {
      const saved = localStorage.getItem('kioskLearningHistory');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  const history = getHistory();
  const successCount = history.filter(r => r.success).length;
  const totalCount = history.length;
  const successRate = totalCount > 0 ? Math.round((successCount / totalCount) * 100) : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md h-[90vh] p-0 gap-0" aria-describedby={undefined}>
        {/* Header */}
        <div className="bg-purple-600 text-white px-6 py-4 flex items-center justify-between">
          <DialogTitle className="text-2xl m-0">학습 기록</DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 rounded-full hover:bg-purple-700 active:bg-purple-500 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Stats */}
        {totalCount > 0 && (
          <div className="bg-purple-50 p-4 border-b">
            <div className="grid grid-cols-3 gap-3">
              <Card className="p-3 text-center border-2 border-purple-200">
                <Trophy className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                <p className="text-lg">{successCount}</p>
                <p className="text-xs text-gray-600">성공</p>
              </Card>
              <Card className="p-3 text-center border-2 border-purple-200">
                <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                <p className="text-lg">{totalCount}</p>
                <p className="text-xs text-gray-600">총 시도</p>
              </Card>
              <Card className="p-3 text-center border-2 border-purple-200">
                <div className="text-2xl mb-1">📊</div>
                <p className="text-lg">{successRate}%</p>
                <p className="text-xs text-gray-600">성공률</p>
              </Card>
            </div>
          </div>
        )}

        {/* Content */}
        <ScrollArea className="flex-1 h-full">
          <div className="p-4">
            {history.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">📝</span>
                </div>
                <p className="text-lg text-gray-600 mb-2">아직 학습 기록이 없습니다</p>
                <p className="text-sm text-gray-500">
                  실전 모드로 연습하면<br />기록이 저장됩니다
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((record) => (
                  <Card
                    key={record.id}
                    className={`p-4 border-2 ${
                      record.success
                        ? 'border-green-200 bg-green-50'
                        : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {record.success ? (
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <Check className="w-5 h-5 text-white" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                            <XCircle className="w-5 h-5 text-white" />
                          </div>
                        )}
                        <Badge
                          variant={record.success ? "default" : "destructive"}
                          className="text-sm"
                        >
                          {record.success ? '성공' : '실패'}
                        </Badge>
                      </div>
                      <span className="text-xs text-gray-500">{record.date}</span>
                    </div>
                    
                    <div className="mb-2">
                      <p className="text-sm text-gray-600 mb-1">미션</p>
                      <p className="text-base">{record.mission}</p>
                    </div>

                    {record.userOrder.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">주문 내역</p>
                        <div className="text-sm">
                          {record.userOrder.map((item, idx) => (
                            <span key={idx}>
                              {item.name} {item.quantity}개
                              {idx < record.userOrder.length - 1 ? ', ' : ''}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}