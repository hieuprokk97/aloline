export class ListMessageByCon {
  conversation_id: number;
  message: string;
  users: {
    username: string;
    user_id: number;
  };

  constructor(data?: any) {
    this.conversation_id = data?.conversation_id || 0;
    this.message = data.message || '';
    this.users = {
      username: data.message_user.username || '',
      user_id: data.message_user.user_id || 0,
    };
  }
  static mapToList(data: any[]) {
    console.log(data);
    return data?.map((item) => new ListMessageByCon(item));
  }
}
