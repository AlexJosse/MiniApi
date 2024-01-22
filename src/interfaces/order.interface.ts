export interface IOrder {
  mini: number;
  userid: number;
  price: number;
  package: string;
  discount: number;
  status: string;
  invoice: any;
}

export interface IOrderUpdate extends IOrder {
  id: number;
  status: string;
}