import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ArrowLeft, ShoppingCart, Plus, Minus, Check, Home, XCircle, Target } from "lucide-react";
import { motion } from "motion/react";
import type { HistoryRecord } from "./LearningHistory";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface Mission {
  text: string;
  required: { name: string; quantity: number }[];
}

interface KioskSimulatorProps {
  isPracticeMode: boolean;
  onExit: () => void;
}

const menuItems: MenuItem[] = [
  { id: "1", name: "불고기버거", price: 4500, category: "버거" },
  { id: "2", name: "치즈버거", price: 4000, category: "버거" },
  { id: "3", name: "새우버거", price: 5000, category: "버거" },
  { id: "4", name: "감자튀김", price: 2000, category: "사이드" },
  { id: "5", name: "치킨너겟", price: 3000, category: "사이드" },
  { id: "6", name: "콜라", price: 1500, category: "음료" },
  { id: "7", name: "사이다", price: 1500, category: "음료" },
  { id: "8", name: "아이스티", price: 2000, category: "음료" },
];

const missions: Mission[] = [
  {
    text: "새우버거 3개, 콜라 1잔을 주문해보세요",
    required: [
      { name: "새우버거", quantity: 3 },
      { name: "콜라", quantity: 1 },
    ],
  },
  {
    text: "불고기버거 2개, 감자튀김 1개를 주문해보세요",
    required: [
      { name: "불고기버거", quantity: 2 },
      { name: "감자튀김", quantity: 1 },
    ],
  },
  {
    text: "치즈버거 1개, 치킨너겟 2개, 사이다 1잔을 주문해보세요",
    required: [
      { name: "치즈버거", quantity: 1 },
      { name: "치킨너겟", quantity: 2 },
      { name: "사이다", quantity: 1 },
    ],
  },
  {
    text: "불고기버거 1개, 콜라 2잔을 주문해보세요",
    required: [
      { name: "불고기버거", quantity: 1 },
      { name: "콜라", quantity: 2 },
    ],
  },
  {
    text: "새우버거 1개, 감자튀김 1개, 아이스티 1잔을 주문해보세요",
    required: [
      { name: "새우버거", quantity: 1 },
      { name: "감자튀김", quantity: 1 },
      { name: "아이스티", quantity: 1 },
    ],
  },
  {
    text: "치즈버거 2개, 사이다 2잔을 주문해보세요",
    required: [
      { name: "치즈버거", quantity: 2 },
      { name: "사이다", quantity: 2 },
    ],
  },
];

export function KioskSimulator({ isPracticeMode, onExit }: KioskSimulatorProps) {
  const [step, setStep] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("버거");
  const [orderComplete, setOrderComplete] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [currentMission, setCurrentMission] = useState<Mission | null>(null);
  const [missionResult, setMissionResult] = useState<'success' | 'fail' | null>(null);

  const categories = ["버거", "사이드", "음료"];

  const practiceSteps = [
    "화면 하단의 '시작하기' 버튼을 눌러주세요",
    "원하시는 메뉴 종류를 선택해주세요",
    "메뉴를 터치해서 선택해주세요",
    "우측 하단 장바구니를 눌러 확인 후 결제해주세요",
  ];

  // 실전모드일 때 랜덤 미션 생성
  useEffect(() => {
    if (!isPracticeMode && !currentMission) {
      const randomMission = missions[Math.floor(Math.random() * missions.length)];
      setCurrentMission(randomMission);
    }
  }, [isPracticeMode, currentMission]);

  const addToCart = (item: MenuItem) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    if (isPracticeMode && step === 2) {
      setStep(3);
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(
      cart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const checkMission = (): boolean => {
    if (!currentMission) return true;

    // 주문 항목 수가 다르면 실패
    if (cart.length !== currentMission.required.length) return false;

    // 각 항목을 확인
    for (const required of currentMission.required) {
      const cartItem = cart.find((item) => item.name === required.name);
      if (!cartItem || cartItem.quantity !== required.quantity) {
        return false;
      }
    }

    return true;
  };

  const saveToHistory = (success: boolean) => {
    if (!currentMission) return;

    const record: HistoryRecord = {
      id: Date.now().toString(),
      date: new Date().toLocaleString('ko-KR', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      mission: currentMission.text,
      success,
      userOrder: cart.map(item => ({ name: item.name, quantity: item.quantity })),
      timestamp: Date.now(),
    };

    try {
      const saved = localStorage.getItem('kioskLearningHistory');
      const history: HistoryRecord[] = saved ? JSON.parse(saved) : [];
      history.unshift(record); // 최신 기록을 앞에 추가
      
      // 최대 50개까지만 저장
      if (history.length > 50) {
        history.splice(50);
      }
      
      localStorage.setItem('kioskLearningHistory', JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save history:', error);
    }
  };

  const handleCheckout = () => {
    if (!isPracticeMode && currentMission) {
      const success = checkMission();
      setMissionResult(success ? 'success' : 'fail');
      saveToHistory(success);
    }
    setOrderComplete(true);
  };

  const handleStart = () => {
    if (isPracticeMode) {
      setStep(1);
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    if (isPracticeMode && step === 1) {
      setStep(2);
    }
  };

  const filteredMenu = menuItems.filter(
    (item) => item.category === selectedCategory
  );

  if (orderComplete) {
    return (
      <div className="flex flex-col h-screen bg-white">
        {/* App Bar */}
        <div className={`shadow-lg ${
          missionResult === 'success' ? 'bg-green-600' :
          missionResult === 'fail' ? 'bg-red-600' :
          'bg-green-600'
        }`}>
          <div className="flex items-center justify-between px-4 py-4">
            <h1 className="text-xl text-white">
              {missionResult === 'success' ? '미션 성공!' :
               missionResult === 'fail' ? '미션 실패' :
               '주문 완료'}
            </h1>
            <button 
              onClick={onExit}
              className={`p-2 rounded-full transition-colors ${
                missionResult === 'success' ? 'hover:bg-green-700 active:bg-green-500' :
                missionResult === 'fail' ? 'hover:bg-red-700 active:bg-red-500' :
                'hover:bg-green-700 active:bg-green-500'
              }`}
            >
              <Home className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center w-full">
            {missionResult === 'success' && (
              <>
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-16 h-16 text-white" />
                </div>
                <h2 className="text-3xl mb-2">미션 성공! 🎉</h2>
                <p className="text-lg text-gray-600 mb-8">
                  정확하게 주문하셨습니다!<br />
                  정말 잘하셨어요!
                </p>
              </>
            )}

            {missionResult === 'fail' && (
              <>
                <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <XCircle className="w-16 h-16 text-white" />
                </div>
                <h2 className="text-3xl mb-2">미션 실패</h2>
                <p className="text-lg text-gray-600 mb-4">
                  주문이 미션과 다릅니다
                </p>
                <Card className="bg-yellow-50 p-4 mb-8 border-2 border-yellow-200">
                  <p className="text-base mb-2">미션</p>
                  <p className="text-lg">{currentMission?.text}</p>
                </Card>
              </>
            )}

            {!missionResult && (
              <>
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-16 h-16 text-white" />
                </div>
                <h2 className="text-3xl mb-2">주문 완료!</h2>
                <p className="text-lg text-gray-600 mb-8">
                  주문이 접수되었습니다<br />
                  번호표를 받아 기다려주세요
                </p>
              </>
            )}
            
            <Card className="bg-gray-50 p-6 mb-8 border-2">
              <p className="text-lg mb-4">주문 내역</p>
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-lg">
                    <span>{item.name} × {item.quantity}</span>
                    <span>{(item.price * item.quantity).toLocaleString()}원</span>
                  </div>
                ))}
              </div>
              <div className="border-t-2 border-gray-300 mt-4 pt-4">
                <div className="flex justify-between text-xl">
                  <span>총 금액</span>
                  <span className={
                    missionResult === 'success' ? 'text-green-600' :
                    missionResult === 'fail' ? 'text-red-600' :
                    'text-green-600'
                  }>{totalPrice.toLocaleString()}원</span>
                </div>
              </div>
            </Card>
            
            <Button
              size="lg"
              className={`w-full h-14 text-xl ${
                missionResult === 'success' ? 'bg-green-600 hover:bg-green-700 active:bg-green-800' :
                missionResult === 'fail' ? 'bg-red-600 hover:bg-red-700 active:bg-red-800' :
                'bg-green-600 hover:bg-green-700 active:bg-green-800'
              }`}
              onClick={onExit}
            >
              처음으로
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* App Bar */}
      <div className="bg-red-600 shadow-lg">
        <div className="flex items-center justify-between px-4 py-4">
          <button 
            onClick={onExit}
            className="p-2 rounded-full hover:bg-red-700 active:bg-red-500 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-xl text-white">햄버거 가게</h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Practice Mode Guide */}
      {isPracticeMode && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-600 text-white px-4 py-3"
        >
          <p className="text-base text-center">
            {step < practiceSteps.length ? practiceSteps[step] : practiceSteps[practiceSteps.length - 1]}
          </p>
        </motion.div>
      )}

      {/* Real Mode Mission */}
      {!isPracticeMode && currentMission && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-orange-600 text-white px-4 py-3"
        >
          <div className="flex items-center justify-center gap-2">
            <Target className="w-5 h-5" />
            <p className="text-base text-center">{currentMission.text}</p>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {step === 0 && isPracticeMode ? (
          <div className="flex items-center justify-center min-h-full p-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-5xl">👋</span>
              </div>
              <h2 className="text-3xl mb-4">환영합니다!</h2>
              <p className="text-lg text-gray-600 mb-8">
                주문을 시작하려면<br />아래 버튼을 눌러주세요
              </p>
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <Button
                  size="lg"
                  className="h-16 px-12 text-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                  onClick={handleStart}
                >
                  시작하기
                </Button>
              </motion.div>
            </div>
          </div>
        ) : (
          <>
            {/* Category Tabs */}
            <div className="bg-white p-3 shadow-sm sticky top-0 z-10">
              <div className="flex gap-2">
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    animate={
                      isPracticeMode && step === 1
                        ? { scale: [1, 1.05, 1] }
                        : {}
                    }
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className={`flex-1 py-3 px-4 rounded-lg text-lg transition-colors ${
                      selectedCategory === category
                        ? "bg-red-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 active:bg-gray-200"
                    }`}
                    onClick={() => handleCategorySelect(category)}
                  >
                    {category}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-4 space-y-3">
              {filteredMenu.map((item) => (
                <motion.div
                  key={item.id}
                  animate={
                    isPracticeMode && step === 2
                      ? { scale: [1, 1.02, 1] }
                      : {}
                  }
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <Card
                    className="overflow-hidden border-2 active:scale-[0.98] transition-transform shadow-sm"
                    onClick={() => addToCart(item)}
                  >
                    <div className="flex items-center p-4 gap-4">
                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-3xl">🍔</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl mb-1">{item.name}</h3>
                        <p className="text-lg text-gray-600">
                          {item.price.toLocaleString()}원
                        </p>
                      </div>
                      <Plus className="w-6 h-6 text-red-600" />
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Bottom Cart Bar */}
      {!(step === 0 && isPracticeMode) && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-lg">
          <div className="max-w-md mx-auto px-4 py-3">
            <div className="flex items-center gap-3">
              <motion.button
                animate={
                  isPracticeMode && step === 3 && cart.length > 0
                    ? { scale: [1, 1.05, 1] }
                    : {}
                }
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="flex-1 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-lg p-4 flex items-center justify-between transition-colors shadow-md disabled:bg-gray-300 disabled:text-gray-500"
                onClick={() => setShowCart(true)}
                disabled={cart.length === 0}
              >
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-6 h-6" />
                  <span className="text-lg">장바구니</span>
                  {cart.length > 0 && (
                    <span className="bg-white text-red-600 rounded-full w-6 h-6 flex items-center justify-center text-sm">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  )}
                </div>
                <span className="text-xl">{totalPrice.toLocaleString()}원</span>
              </motion.button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white w-full max-w-md mx-auto rounded-t-3xl shadow-2xl max-h-[80vh] flex flex-col"
          >
            <div className="p-6 border-b">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl">장바구니</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <p className="text-lg text-gray-500 text-center py-8">
                  메뉴를 선택해주세요
                </p>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="border-b pb-4">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-lg">{item.name}</span>
                        <span className="text-lg">
                          {(item.price * item.quantity).toLocaleString()}원
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-10 w-10 rounded-full border-2 active:bg-gray-100"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="text-xl w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-10 w-10 rounded-full border-2 active:bg-gray-100"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 border-t bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl">총 금액</span>
                <span className="text-2xl text-red-600">{totalPrice.toLocaleString()}원</span>
              </div>
              <Button
                size="lg"
                className="w-full h-14 text-xl bg-red-600 hover:bg-red-700 active:bg-red-800"
                disabled={cart.length === 0}
                onClick={handleCheckout}
              >
                결제하기
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
