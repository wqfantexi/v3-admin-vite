import { Md5 } from "ts-md5";

/**加密密码 */
export function encryptPassword(password: string) {
    const md5: any = new Md5();
    md5.appendAsciiStr(`7908493138BE7D792898DDFA6EBD7294#${password.trim()}#A978F11F115E7503817C36385F8086D3`);
    return md5.end();
}
