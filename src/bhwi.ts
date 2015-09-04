class bhwiUser {
    id: number;
    name: string;
    client_id: number;

    constructor(name: string, client_id: number) {
        this.name = name;
        this.client_id = client_id;
        this.id = this.getId(name, client_id)
    }

    getId(name: string, client_id: number) {
      // jQuery get
      console.log('https://api.instagram.com/v1/users/search?q=' + name + '&client_id=' + client_id);
      return 1;
    }
}

