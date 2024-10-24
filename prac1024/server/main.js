import { Meteor } from 'meteor/meteor';
import { Contacts } from "/imports/api/collections";


// Contacts 전체 삭제
Contacts.remove({});



// 초기 데이터 삽입
if (Contacts.find().count() === 0) {
  Contacts.insert({ name: "폼폼푸린", phone: "010-1234-5678", createdAt: new Date() });
  Contacts.insert({ name: "시나모롤", phone: "010-1234-5678", createdAt: new Date() });
  Contacts.insert({ name: "포챠코", phone: "010-1234-5678", createdAt: new Date() });
}

Meteor.methods({
  "getList"() {
    return Contacts.find({}, { sort: { createdAt: -1 } }).fetch();  // 최신순 정렬
  },
  "contacts.insert"(name, phone) {
    return Contacts.insert({
      name,
      phone,
      createdAt: new Date(),
    });
  },
  saveContact: (contact) => {
    contact.createdAt = new Date();
    Contacts.insert(contact);
  },
  removeContact: (contact_id) => {
    Contacts.remove({ _id: contact_id });  // 잘못된 구문 수정
  },
});
