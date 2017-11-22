export class TextPool {
  private map: {[key: string]: string} = Object.create(null);

  private ids: {[root: string]: number} = {};

  private readonly prefix: string = 'text_';

  public put(text: string, root: string): string {
    const existingId = this.getId(text);
    if (existingId) {
      return existingId;
    }
    const id = this.nextId(root);
    this.map[text] = id;

    return id;
  }

  public getId(text: string): string {
    const id = this.map[text];

    return id;
  }

  private nextId(root: string): string {
    let id: number | undefined = this.ids[root];
    if (typeof id === 'undefined') {
      id = 0;
    } else {
      id++;
    }
    this.ids[root] = id;

    return `${this.prefix}${root}_${String(id)}`;
  }
}
