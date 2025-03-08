// Generic type for API response
type ApiResponse<T> = {
  data: T;
  status: number;
  message: string;
  timestamp: Date;
};

// Example domain types
interface User {
  id: number;
  name: string;
  email: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
}

// Utility type to make all properties optional
type PartialPost = Partial<Post>;

// Function using the generic API response type
async function fetchUser(id: number): Promise<ApiResponse<User>> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
} 