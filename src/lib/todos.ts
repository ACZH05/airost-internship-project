const API_URL = import.meta.env.VITE_API_URL

export interface Todo {
  id: string;
  text: string;
  userId: string;
  groupId: string;
  status: 'pending' | 'process' | 'completed';
  timestamp: Date;
  assignedTo?: string[]; 
}

export const sendTodo = async (text: string, groupId: string, idToken: string) => {
  try {
    const apiResponse = await fetch(`${API_URL}todo/send`, {
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
    const response = await fetch(`${API_URL}todo?groupId=${groupId}`, {
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
    const response = await fetch(`${API_URL}todo`, {
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

export const deleteTodo = async (todoId: string, idToken: string) => {
  try {
    const response = await fetch(`${API_URL}todo`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify({ todoId })
    });
    if (!response.ok) throw new Error('Failed to delete todo');
    return await response.json();
  } catch (error) {
    console.error('Error deleting todo:', error);
    return { success: false, error };
  }
};

export const assignTodo = async (todoId: string, assignedTo: string[], idToken: string) => {
  try {
    const response = await fetch(`${API_URL}todo/assign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify({ todoId, assignedTo })
    });
    if (!response.ok) throw new Error('Failed to assign todo');
    return await response.json();
  } catch (error) {
    console.error('Error assigning todo:', error);
    return { success: false, error };
  }
};

export const getUserProfile = async (userId: string, idToken: string) => {
  try {
    const response = await fetch(`${API_URL}profile/info/${userId}`, {
      headers: {
        'Authorization': `Bearer ${idToken}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch user profile');
    return await response.json();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return { success: false, error };
  }
};