import { useState, useCallback } from "react";
import menu from "@/assets/menu.json";
import "./App.css";

function calcSum(arr: any[]): number {
  let ret: number = 0;
  for (const item of arr) {
    ret += item.price;
  }
  return ret;
}

function App() {
  const [foodNum, setFoodNum] = useState<any>(3);
  const [personNum, setPersonNum] = useState<any>(4);
  const [orders, setOrders] = useState<any>([]);
  const [sum, setSum] = useState(0);

  const roll = useCallback(
    (arr: any[]) => {
      if (arr.length === foodNum) {
        setOrders(arr);
        setSum(calcSum(arr));
        return;
      }
      const rand = Math.floor(Math.random() * menu.length);
      const selected = menu[rand];
      if (!JSON.stringify(arr).includes(selected.name)) {
        arr.push(menu[rand]);
      }
      roll(arr);
    },
    [foodNum]
  );

  const confirm = useCallback(async () => {
    await navigator.clipboard.writeText(`老板\n${orders.map((item: any) => item.name).join('，')}\n${personNum}个人，12点来吃`);
    alert('已复制到剪贴板');
  }, [personNum, orders]);

  return (
    <div className="App">
      <div className="menu-container">
        {menu.map((item: { name: string; price: number }, idx) => (
          <div className="item" key={idx}>
            {item.name} - {item.price}
          </div>
        ))}
      </div>
      <div className="ub ub-ac mar-b10">
        <div className="mar-r10">
          <input value={foodNum} onChange={(e) => setFoodNum(e.target.value)} />
          <span>菜</span>
        </div>
        <div className="mar-r10">
          <input
            value={personNum}
            onChange={(e) => setPersonNum(e.target.value)}
          />
          <span>人</span>
        </div>
        <button className="mar-r10" onClick={() => roll([])}>
          Roll
        </button>
        <button onClick={confirm}>确定</button>
      </div>
      <div>
        {orders.map((item: { name: string; price: number }, idx: number) => (
          <span key={idx} style={{ color: "red" }}>
            {item.name}，
          </span>
        ))}
        <span>
          总价：
          {sum}
          ，人均：
          {sum / personNum}
        </span>
      </div>
    </div>
  );
}

export default App;
