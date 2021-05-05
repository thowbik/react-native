import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class IonicStorageService {

  constructor(private storage: Storage) {
    //console.log("Storage Driver",this.storage.driver)
  }
  insertData_Replace(key, data) {
    //console.log(key)
    return this.storage.set(this.getKey(key), data);
  }
  insertData_noReplace(key, data) {
    this.getData(key).then(res => {
      let temp = []
      if (res) {
        temp = res
        temp.push(data)
      }
      else {
        temp = [data]
      }
      return this.storage.set(this.getKey(key), temp)
    })
  }
  getData(key) {
    //  console.log("get data key",this.getKey(key));
   // console.log("get data provider", this.storage.get(this.getKey(key)))
    //  console.log("all key in storage",this.storage.keys())
    return this.storage.get(this.getKey(key));
  }
  removeKey(key) {
    return this.storage.remove(this.getKey(key));
  }

  loopData(key) {
    return this.storage.forEach(this.getKey(key))
  }

  getKey(key) {
    switch (key) {
      case "schoollistbydistrictid":
        return "schoolListBy_District_id"
      case 'teacherlist':
        return "teacherListBy_school_id"
      case "studentlist":
        return "studentListBy_school_id"
      case "learningoutcomeques":
        return "learningOutcomeQues"
      case "school_id":
        return "currentSchool_id"
      case "classroom-data":
        return "school_selection_form"
      case "teacher-info":
        return "teacher_info_form"
      case "classroom-type":
        return "classroom_selection_form"
      case "questions":
        return "classroom_observation_form"
      case "pedagogy-info":
        return "pedagogy_info_form"
      case "student-list":
        return "student_list_form"
      case "tntp-content":
        return "tntp_content_form"
      case "learning-outcome":
        return "learning_outcome_form"
      case "record-verification":
        return "record_verification_form"

      default:
        return key
    }
  }


  setStoreData(storeData) {
    this.storage.set('storeData', storeData);

  }
  getStoreData() {
    return this.storage.get('storeData');

  }
  removeStoreData() {
    //this.storage.clear()
    this.storage.remove('storeData');
  }
  setFinalData(storeData) {
    this.storage.set('storeFinalData', storeData);

  }
  getFinalData() {
    return this.storage.get('storeFinalData');

  }
  removeFinalData() {
    this.storage.remove('storeFinalData');
    this.storage.clear()
    // .then((response)=>{
      
    // });
  }
  setOffStorage(storeData){
    this.storage.set('offStoreData', storeData);
  }
  getOffStorage() {
    return this.storage.get('offStoreData');
  }
  removeOffStorage() {
    this.storage.remove('offStoreData');
  }
  setCorrectedClass(correctClassList) {
    this.storage.set('correctClassList', correctClassList);
  }
  getCorrectedClass() {
    return this.storage.get('correctClassList');
  }
  removeCorrectedClass() {
    this.storage.remove('correctClassList');
  }

}
