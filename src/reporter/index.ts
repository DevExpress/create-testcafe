export default class Reporter {
    log (message: string): void {
        console.log(message);
    }

    error (message: string): void {
        console.error(message);
    }
}
