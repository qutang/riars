

class Subject {
    constructor(id) {
        this._id = id;
        this._age = undefined;
        this._gender = undefined;
        this._weight = undefined;
        this._height = undefined;
        this._blood_pressure = undefined;
        this._heart_rate = undefined;
        this._dress = undefined;
        this._shoes = undefined;
        this._dominantHand = undefined;
        this._dominantFoot = undefined;
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

    get blood_pressure() {
        return this._blood_pressure
    }

    set blood_pressure(value) {
        this._blood_pressure = value
    }

    get heart_rate() {
        return this._heart_rate
    }

    set heart_rate(value) {
        this._heart_rate = value
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

    get dominantHand() {
        return this._dominantHand
    }

    set dominantHand(value) {
        this._dominantHand = value
    }

    get dominantFoot() {
        return this._dominantFoot
    }

    set dominantFoot(value) {
        this._dominantFoot = value
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
        subject.blood_pressure = jsonData['blood_pressure'];
        subject.heart_rate = jsonData['heart_rate'];
        subject.dress = jsonData['dress'];
        subject.shoes = jsonData['shoes'];
        subject.dominantHand = jsonData['dominant_hand'];
        subject.dominantFoot = jsonData['dominant_foot'];
        return subject;
    }

    toJSON() {
        const { id, age, gender, weight, height, blood_pressure, heart_rate, dress, shoes, dominantHand, dominantFoot, selected } = this;
        return { id, age, gender, selected, weight, height, blood_pressure, heart_rate, dress, shoes, dominant_hand: dominantHand, dominant_foot: dominantFoot };
    }
}

export default Subject;