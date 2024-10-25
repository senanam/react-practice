// app.jsx

import React, { useRef } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Task } from "../api/collections";

export const App = () => {
  const inputRef = useRef(null);

  const { tasks, isLoading } = useTracker(() => {
    const handle = Meteor.subscribe("task");
    return {
      tasks: Task.find({}, { sort: { createdAt: -1 } }).fetch(),
      isLoading: !handle.ready(),
    };
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTask = inputRef.current.value.trim();
    if (newTask) {
      Meteor.call("task.insert", newTask, (error) => {
        if (error) {
          console.error("Error inserting task:", error.reason);
        } else {
          inputRef.current.value = ""; // 입력 필드 초기화
        }
      });
    }
  };

  const deleteTask = (taskId) => {
    Meteor.call("task.remove", taskId);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          ref={inputRef}
          placeholder="새로운 할 일 적어주세요"
        />
        <button type="submit">Add Task</button>
      </form>
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            <span>{task.text}</span>
            <button onClick={() => deleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// 1. `useTracker` 훅:
//    - Meteor의 반응형 데이터 시스템과 React의 컴포넌트 시스템을 연결해주는 중요한 도구입니다.
//    - Meteor의 반응형 데이터 소스를 추적하고, 데이터가 변경될 때마다 React 컴포넌트를 자동으로 리렌더링합니다.

// 3. `Meteor.subscribe("task")`:
//    - 서버에서 발행한 "task" 발행(publication)을 구독합니다.
//    - 이를 통해 서버의 Task 컬렉션 데이터를 클라이언트로 동기화합니다.

// 4. `Task.find({}, { sort: { createdAt: -1 } }).fetch()`:
//    - Task 컬렉션에서 모든 문서를 찾습니다.
//    - `createdAt` 필드를 기준으로 내림차순 정렬합니다(-1은 내림차순을 의미).
//    - `fetch()`를 호출하여 결과를 배열로 가져옵니다.

// 5. `isLoading: !handle.ready()`:
//    - `handle.ready()`는 구독이 준비되었는지(데이터가 서버에서 완전히 전송되었는지) 여부를 반환합니다.
//    - `!handle.ready()`는 이를 뒤집어서, 아직 로딩 중인지 여부를 나타냅니다.

// 6. 반환값:
//    ```javascript
//    const { tasks, isLoading } = useTracker(() => { ... });
//    ```
//    - `useTracker`는 콜백 함수의 반환값을 그대로 반환합니다.
//    - 여기서는 `tasks` 배열과 `isLoading` 불리언 값을 구조 분해 할당으로 받아옵니다.

// 7. 반응형 동작:
//    - 서버의 Task 컬렉션 데이터가 변경될 때마다, 이 `useTracker` 콜백이 자동으로 다시 실행됩니다.
//    - 그 결과, `tasks` 배열이 업데이트되고 컴포넌트가 리렌더링됩니다.

// 8. 성능 최적화:
//    - `useTracker`는 내부적으로 최적화되어 있어, 실제로 데이터가 변경된 경우에만 컴포넌트를 리렌더링합니다.
