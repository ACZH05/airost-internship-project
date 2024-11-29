export interface ChatMessage {
  id: string;
  text: string;
  userId: string;
  groupId: string;
  timestamp: Date;
}

export const sendMessage = async (text: string, userId: string, groupId: string, idToken: string) => {
  try {
    const apiResponse = await fetch('http://localhost:3000/api/chat/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify({
        text,
        groupId
      })
    });

    if (!apiResponse.ok) {
      throw new Error('API request failed');
    }

    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export const getGroups = async (idToken: string) => {
  try {
    const response = await fetch('http://localhost:3000/api/chat/groups', {
      headers: {
        'Authorization': `Bearer ${idToken}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch groups');
    return await response.json();
  } catch (error) {
    console.error('Error fetching groups:', error);
    return { success: false, error };
  }
};

export const getMessages = async (groupId: string, idToken: string) => {
  try {
    const response = await fetch(`http://localhost:3000/api/chat/messages/${groupId}`, {
      headers: {
        'Authorization': `Bearer ${idToken}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch messages');
    return await response.json();
  } catch (error) {
    console.error('Error fetching messages:', error);
    return { success: false, error };
  }
};

export const createGroup = async (name: string, idToken: string) => {
  try {
    const response = await fetch('http://localhost:3000/api/chat/groups', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify({ name })
    });
    if (!response.ok) throw new Error('Failed to create group');
    return await response.json();
  } catch (error) {
    console.error('Error creating group:', error);
    return { success: false, error };
  }
};

export interface GroupMember {
  uid: string;
  email: string;
  isAdmin: boolean;
}

export const getGroupMembers = async (groupId: string, idToken: string) => {
  try {
    const response = await fetch(`http://localhost:3000/api/chat/members?groupId=${groupId}`, {
      headers: {
        'Authorization': `Bearer ${idToken}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch members');
    return await response.json();
  } catch (error) {
    console.error('Error fetching members:', error);
    return { success: false, error };
  }
};

export const addGroupMember = async (groupId: string, email: string, idToken: string) => {
  try {
    const response = await fetch('http://localhost:3000/api/chat/members', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify({ groupId, email })
    });
    if (!response.ok) throw new Error('Failed to add member');
    return await response.json();
  } catch (error) {
    console.error('Error adding member:', error);
    return { success: false, error };
  }
};

export interface Todo {
  id: string;
  text: string;
  userId: string;
  groupId: string;
  status: 'pending' | 'process' | 'completed';
  timestamp: Date;
}

export const sendTodo = async (text: string, groupId: string, idToken: string) => {
  try {
    const apiResponse = await fetch('http://localhost:3000/api/todo/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify({
        text,
        groupId
      })
    });

    if (!apiResponse.ok) {
      throw new Error('API request failed');
    }

    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export const getTodos = async (groupId: string, idToken: string) => {
  try {
    const response = await fetch(`http://localhost:3000/api/todo?groupId=${groupId}`, {
      headers: {
        'Authorization': `Bearer ${idToken}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch todos');
    return await response.json();
  } catch (error) {
    console.error('Error fetching todos:', error);
    return { success: false, error };
  }
};

export const updateTodoStatus = async (todoId: string, newStatus: string, idToken: string) => {
  try {
    const response = await fetch('http://localhost:3000/api/todo', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify({ todoId, newStatus })
    });
    if (!response.ok) throw new Error('Failed to update todo status');
    return await response.json();
  } catch (error) {
    console.error('Error updating todo status:', error);
    return { success: false, error };
  }
};
