export interface Todo { 
  userId: number,
  id: number,
  title: string,
  completed: boolean,
  priority: 'low' | 'medium' | 'high';
}

