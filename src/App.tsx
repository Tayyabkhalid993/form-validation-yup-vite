import { useState } from 'react'
import * as yup from 'yup';

export default function App() {
  interface dataType {
    id: number,
    name: string,
    phone: number | null
  }

  let userSchema = yup.object({
    name: yup.string().required().min(3),
    phone: yup.number().required().positive().integer(),
    email: yup.string().email(),
    website: yup.string().url().nullable(),
    createdOn: yup.date().default(() => new Date()),
  });

  const [data, setData] = useState<dataType[]>([])
  const [userName, setUserName] = useState<string>("");
  const [userPhone, setUserPhone] = useState<number | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const onDeleteHandle = (id: number) => {
    const updateData = data.filter(item => item.id !== id)
    setData(updateData);
  }

  const onEditHandle = (item: dataType) => {
    setEditId(item.id);
    setUserName(item.name);
    setUserPhone(item.phone);
  }

  const onSubmitHandle = async () => {
    try {
     await userSchema.validate({
        name: userName,
        phone: userPhone
      })

      if (editId) {
        const editData = data.map(item => item.id == editId ? { ...item, name: userName, phone: userPhone } : item);
        setData(editData)
        setUserName("");
        setUserPhone(null);
        setEditId(null);
      } else {
        const newData: dataType = {
          id: data.length + 1,
          name: userName,
          phone: userPhone
        }
        setData([...data, newData]);
        setUserName("");
        setUserPhone(null);
      }
      setFormError(null); // Clear any previous errors
    } catch (error) {
      if (error instanceof Error) {
        setFormError(error.message);
      } else {
        setFormError("An unknown error occurred");
      }
    }
  }

  return (
    <div>
      <h1>User Data</h1>

      <label htmlFor="">User Name</label>
      <input value={userName} onChange={(e) => setUserName(e.target.value)} type="text" />
      <label htmlFor="">User Phone</label>
      <input value={userPhone || ""} onChange={(e) => setUserPhone(e.target.value ? parseInt(e.target.value) : null)} type="text" />
      {formError && <span style={{ color: 'red' }}>{formError}</span>}
      <button onClick={onSubmitHandle}>{editId ? "Update" : "Submit"}</button>
      {data.map((item) => (
        <div key={item.id}>
          <span className='p-6'>{item.id}</span>
          <span className='p-6'>{item.name}</span>
          <span className='p-6'>{item.phone}</span>
          <button onClick={() => onEditHandle(item)}>Edit</button>
          <button onClick={() => onDeleteHandle(item.id)}>Delete</button>
        </div>
      ))}
    </div>
  )
}