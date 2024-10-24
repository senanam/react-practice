import React, { useEffect, useState, useRef } from "react";
import { Meteor } from "meteor/meteor";

export const App = () => {
  const [list, setList] = useState([]);  // 연락처 리스트 상태
  const nameRef = useRef(null);
  const phoneRef = useRef(null);

  // DB에 있는 데이터들을 화면에 뿌리기
  useEffect(() => {
    Meteor.call("getList", (err, rslt) => {
      if (!err) {
        setList(rslt);
      }
    });
  }, []);

  // 데이터 추가 기능
  const addContact = (e) => {
    e.preventDefault();
    const name = nameRef.current.value;
    const phone = phoneRef.current.value;
    if (name && phone) {
      Meteor.call("contacts.insert", name, phone, (error) => {
        if (!error) {
          // 연락처가 추가되면 리스트를 다시 불러오기
          Meteor.call("getList", (err, rslt) => {
            setList(rslt);
          });
        } else {
          console.log(error);
        }
      });
    }
  };

  // 데이터 추가 버튼
  const handleSave = () => {
    const obj = {
      name: nameRef.current.value,  // 잘못된 구문 수정
      phone: phoneRef.current.value
    };

    Meteor.call('saveContact', obj, (err, rslt) => {
      if (!err) {
        alert("저장완료");
        Meteor.call("getList", (err, rslt) => {  // 저장 후 리스트 다시 불러오기
          setList(rslt);
        });
      }
    });
  };

  // 데이터 삭제 버튼
  const handleRemove = (contact_id) => {  // 삭제할 ID를 전달받도록 수정
    Meteor.call("removeContact", contact_id, (err, rslt) => {
      if (!err) {
        alert("잘 삭제됨");
        Meteor.call("getList", (err, rslt) => {  // 삭제 후 리스트 다시 불러오기
          setList(rslt);
        });
      }
    });
  };

  return (
    <div>
      <div>
        <form onSubmit={addContact}>
          <input type="text" ref={nameRef} placeholder="이름" />
          <input type="text" ref={phoneRef} placeholder="전화번호" />
          <button type="submit" onClick={handleSave}>추가</button>
        </form>
      </div>

      <div>
        <ul>
          {list.map((item) => (  // `list`로 수정
            <li key={item._id}>{item.name}: {item.phone}
              <button onClick={() => handleRemove(item._id)}>삭제</button>  {/* 삭제 버튼에 ID 전달 */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
