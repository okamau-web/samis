export interface TableAction {

  action: 'view' | 'edit' | 'delete' | 'activate' | 'suspend';

  row: any;

}