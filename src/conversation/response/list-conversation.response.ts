export class ListConversationResponse {
  conversation_id: string;
  last_message_id: number;
  type: number;
  last_activity: string;
  members: MemberResponse[];

  constructor(data?: any) {
    this.conversation_id = data.conversation_id || '';
    this.last_message_id = data.last_message_id || 0;
    this.type = data.type || 0;
    this.last_activity = data.last_activity || 0;
    this.members = MemberResponse.mapToList(data?.members || []);
  }

  static mapToList(data: any[]) {
    return data?.map((item) => new ListConversationResponse(item));
  }
}
export class MemberResponse {
  user_id: number;
  username: string;

  constructor(data?: any) {
    this.user_id = data.user_id || 0;
    this.username = data.username || '';
  }

  static mapToList(data: any[]) {
    return data.map((item) => new MemberResponse(item));
  }
}
