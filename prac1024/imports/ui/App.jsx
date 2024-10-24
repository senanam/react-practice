// App.jsx

import React, { useEffect, useState, useRef } from "react";
import { Meteor } from "meteor/meteor";

export const App = () => {
  const [list, setList] = useState([]);  // 연락처 리스트 상태
  const nameRef = useRef(null);
  const phoneRef = useRef(null);

  // 연락처 목록을 가져오는 함수
  const fetchContactList = () => {
    Meteor.call("getList", (err, rslt) => {
      if (!err) {
        setList(rslt);
      } else {
        console.log(err);
      }
    });
  };

  // 컴포넌트가 처음 렌더링될 때 연락처 목록 가져오기
  useEffect(() => {
    fetchContactList();
  }, []);

  // 데이터 추가 기능
  const addContact = (e) => {
    e.preventDefault();
    const name = nameRef.current.value;
    const phone = phoneRef.current.value;
    if (name && phone) {
      Meteor.call("contacts.insert", name, phone, (error) => {
        if (!error) {
          nameRef.current.value = ''; // 입력 필드 초기화
          phoneRef.current.value = ''; 
          fetchContactList();  // 연락처 추가 후 리스트 다시 불러오기
        } else {
          console.log(error);
        }
      });
    }
  };

  // 데이터 추가 버튼
  const handleSave = () => {
    const obj = {
      name: nameRef.current.value,
      phone: phoneRef.current.value,
    };

    Meteor.call('saveContact', obj, (err, rslt) => {
      if (!err) {
        alert("저장 완료");
        nameRef.current.value = ''; // 입력 필드 초기화
        phoneRef.current.value = '';
        fetchContactList();  // 저장 후 리스트 다시 불러오기
      } else {
        console.log(err);
      }
    });
  };

  // 데이터 삭제 버튼
  const handleRemove = (contact_id) => {
    Meteor.call("removeContact", contact_id, (err, rslt) => {
      if (!err) {
        alert("삭제 완료");
        fetchContactList();  // 삭제 후 리스트 다시 불러오기
      } else {
        console.log(err);
      }
    });
  };

  return (
    <div>
      <div>
        <form onSubmit={addContact}>
          <input type="text" ref={nameRef} placeholder="이름" />
          <input type="text" ref={phoneRef} placeholder="전화번호" />
          <button type="submit">추가</button>
        </form>
      </div>

      <div>
        <ul>
          {list.map((item) => (
            <li key={item._id}>{item.name}: {item.phone}
              <button onClick={() => handleRemove(item._id)}>삭제</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
