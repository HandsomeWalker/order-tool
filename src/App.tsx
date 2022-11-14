import { useState, useCallback, useRef, useEffect } from "react";
import menu from "@/assets/menu.json";
import "./App.css";
import { ActionSheet } from "antd-mobile";
import type {
  Action,
  ActionSheetShowHandler,
} from "antd-mobile/es/components/action-sheet";

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
  const handler = useRef<ActionSheetShowHandler>();

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
    await navigator.clipboard.writeText(
      `老板\n${orders
        .map((item: any) => item.name)
        .join("，")}\n${personNum}个人，12点来吃`
    );
    alert("已复制到剪贴板");
  }, [personNum, orders]);

  const onMenuClick = useCallback(
    (clickItem: any) => {
      const actions: Action[] = orders.map((item: any, idx: number) => ({
        text: item.name + item.price,
        key: idx,
        onClick: (e: any) => {
          let temp = JSON.parse(JSON.stringify(orders));
          temp.splice(idx, 1, clickItem);
          setOrders(temp);
          setSum(calcSum(temp));
          handler.current?.close();
        },
      }));
      handler.current = ActionSheet.show({
        actions,
        extra: `${clickItem.name}${clickItem.price}替换`,
      });
    },
    [orders]
  );

  useEffect(() => {
    roll([]);
  }, []);

  return (
    <div className="App">
      <div className="ub ub-ac mar-b10">
        <div className="mar-r10">
          <input
            style={{ width: 50 }}
            value={foodNum}
            onChange={(e) => setFoodNum(parseInt(e.target.value || "0"))}
          />
          <span>菜</span>
        </div>
        <div className="mar-r10">
          <input
            style={{ width: 50 }}
            value={personNum}
            onChange={(e) => setPersonNum(parseInt(e.target.value || "0"))}
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
            {item.name} - {item.price}，
          </span>
        ))}
        <span>
          总价：
          {sum}
          ，人均：
          {personNum === 0 ? 0 : sum / personNum}
        </span>
      </div>
      <div className="menu-container">
        {menu.map((item: { name: string; price: number }, idx) => (
          <div className="item" key={idx} onClick={() => onMenuClick(item)}>
            {item.name} - {item.price}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
