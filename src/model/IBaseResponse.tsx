export interface IBaseResponse{
    success: boolean,
    message: string,
    code: number,
    data: any,
    fields: string[]
}