import { useState } from "react";
import "./App.css";

function App() {
  const [items, setItems] = useState([]);
  function Additem(item) {
    setItems((items) => [...items, item]);
  }
  function Deleteitem(id) {
    setItems((items) => items.filter((item) => item.id !== id));
  }
  function Doneitem(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }
  function RemoveAll() {
    const confirmed = window.confirm(
      "Are You Sure You Want To Delete All Items"
    );
    if (confirmed) setItems([]);
  }

  return (
    <div className="app">
      <Logo />
      <Form items={items} Additem={Additem} />
      <PackingList
        items={items}
        Deleteitem={Deleteitem}
        Doneitem={Doneitem}
        RemoveAll={RemoveAll}
      />
      <Stats items={items} />
    </div>
  );
}

function Logo() {
  return <h1>🌴 Far Away 👜</h1>;
}

function Form({ items, Additem }) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  function hundlesubmit(e) {
    e.preventDefault();
    if (description === "") return;
    const newItem = { description, quantity, packed: false, id: new Date() };
    Additem(newItem);
    console.log(newItem);
    setDescription("");
    setQuantity(1);
  }
  return (
    <form className="add-form" onSubmit={hundlesubmit}>
      <h3>What do you need for your 😎 trip ?</h3>
      <select value={quantity} onChange={(e) => setQuantity(e.target.value)}>
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        type="text"
        placeholder="Item..."
      ></input>

      <button>ADD</button>
    </form>
  );
}

function PackingList({ items, Deleteitem, Doneitem, RemoveAll }) {
  const [sortby, setSortby] = useState("input");

  let sortitems;

  if (sortby === "input") sortitems = items;
  if (sortby === "description") {
    sortitems = items
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));
  }

  if (sortby === "statut") {
    sortitems = items.slice().sort((a, b) => Number(b.packed) - a.packed);
  }
  return (
    <div className="list">
      <ul>
        {sortitems.map((item) => (
          <Item
            item={item}
            key={item.id}
            Deleteitem={Deleteitem}
            Doneitem={Doneitem}
          />
        ))}
      </ul>
      <div className="actions">
        <button onClick={RemoveAll}>Clear All</button>

        <select value={sortby} onChange={(e) => setSortby(e.target.value)}>
          <option value={"input"}>Sort By input Order</option>
          <option value={"description"}>sort by Description</option>
          <option value={"statut"}>sort by packed statut</option>
        </select>
      </div>
    </div>
  );
}
function Item({ item, Deleteitem, Doneitem }) {
  return (
    <li>
      <input
        type="checkbox"
        value={item.packed}
        onChange={() => Doneitem(item.id)}
      ></input>
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.description}
      </span>
      <button onClick={() => Deleteitem(item.id)}>❌</button>
    </li>
  );
}
function Stats({ items }) {
  const numtasks = items.length;
  const numofpacked = items.filter((item) => item.packed === true).length;
  const percentage = Math.round((numofpacked / numtasks) * 100);
  return (
    <footer className="stats">
      <em>
        {percentage === 100
          ? `You got everthing! Ready to go ✈`
          : ` 👜 You have ${numtasks} items on your list, and you already packed${" "}
        ${numofpacked} (${isNaN(percentage) ? "0" : percentage}%)`}
      </em>
    </footer>
  );
}
export default App;
