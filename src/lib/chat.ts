const API_URL = import.meta.env.VITE_API_URL

export interface ChatMessage {
  id: string;
  text: string;
  userId: string;
  groupId: string;
  timestamp: Date;
  fileId?: string;
  fileName?: string;
  fileUrl?: string;
  fileType?: string;
}

export const sendMessage = async (text: string | null, userId: string, groupId: string, idToken: string, fileMetadata?: any) => {
  try {
    let endpoint = `${API_URL}chat/send`;
    let headers: HeadersInit = {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json'
    };

    const body = JSON.stringify({
      text,
      groupId,
      fileMetadata
    });

    const apiResponse = await fetch(endpoint, {
      method: 'POST',
      headers,
      body
    });

    if (!apiResponse.ok) {
      const error = await apiResponse.json();
      throw new Error(error.error || 'API request failed');
    }

    return await apiResponse.json();
  } catch (error) {
    console.error('Error sending message:', error);
    return { success: false, error };
  }
};

export const getGroups = async (idToken: string) => {
  try {
    const response = await fetch(`${API_URL}chat/groups`, {
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
    const response = await fetch(`${API_URL}chat/messages/${groupId}`, {
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
    const response = await fetch(`${API_URL}chat/groups`, {
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
    const response = await fetch(`${API_URL}chat/members?groupId=${groupId}`, {
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
    const response = await fetch(`${API_URL}chat/members`, {
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
