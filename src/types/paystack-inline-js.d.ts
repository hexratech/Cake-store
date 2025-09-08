declare module '@paystack/inline-js' {
export default class PaystackPop {
    constructor();
    newTransaction(config: {
    key: string;
    email: string;
    amount: number;
    reference?: string;
    onSuccess: (transaction: { reference: string }) => void;
    onCancel?: () => void;
    }): void;
}
}
