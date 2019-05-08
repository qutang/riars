

class Subject {
    constructor(id) {
        this._id = id;
        this._age = undefined;
        this._gender = undefined;
        this._weight = undefined;
        this._height = undefined;
        this._dress = undefined;
        this._shoes = undefined;
        this._dominantSide = undefined;
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

    get weight() {
        return this._weight
    }

    set weight(value) {
        this._weight = value
    }

    get height() {
        return this._height
    }

    set height(value) {
        this._height = value
    }

    get dress() {
        return this._dress
    }

    set dress(value) {
        this._dress = value
    }

    get selected() {
        return this._selected
    }

    get shoes() {
        return this._shoes
    }

    set shoes(value) {
        this._shoes = value
    }

    get dominantSide() {
        return this._dominantSide
    }

    set dominantSide(value) {
        this._dominantSide = value
    }

    set selected(value) {
        this._selected = value
    }

    static fromJSON(jsonData) {
        const subject = new Subject(jsonData['id']);
        subject.selected = jsonData['selected'];
        subject.age = jsonData['age'];
        subject.gender = jsonData['gender'];
        subject.weight = jsonData['weight'];
        subject.height = jsonData['height'];
        subject.dress = jsonData['dress'];
        subject.shoes = jsonData['shoes'];
        subject.dominantSide = jsonData['dominant_side'];
        return subject;
    }

    toJSON() {
        const { id, age, gender, weight, height, dress, shoes, dominantSide, selected } = this;
        return { id, age, gender, selected, weight, height, dress, shoes, dominant_side: dominantSide };
    }
}

export default Subject;