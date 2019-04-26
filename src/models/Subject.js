

class Subject {
    constructor(id) {
        this._id = id;
        this._age = undefined;
        this._gender = undefined;
        this._selected = false;
    }

    clone() {
        const newSubject = new Subject(this.id);
        newSubject.selected = this.selected;
        return newSubject;
    }

    get id() {
        return this._id
    }

    set id(value) {
        this._id = value
    }

    get gender() {
        return this._gender
    }

    set gender(value) {
        this._gender = value
    }

    get age() {
        return this._age
    }

    set age(value) {
        this._age = value
    }

    get selected() {
        return this._selected
    }

    set selected(value) {
        this._selected = value
    }

    static fromJSON(jsonData) {
        const subject = new Subject(jsonData['id']);
        subject.selected = jsonData['selected'];
        subject.age = jsonData['age'];
        subject.gender = jsonData['gender'];
        return subject;
    }

    toJSON() {
        const { id, age, gender, selected } = this;
        return { id, age, gender, selected };
    }
}

export default Subject;