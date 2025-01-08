import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';



const headers = new HttpHeaders()
  .set('content-type', 'application/json')
  .set('Access-Control-Allow-Origin', '*');
  
@Injectable({
  providedIn: 'root'
})
export class PolicyService {


  BASE_URL = environment.BASE_ENDPOINT;

  constructor(
    private http: HttpClient,
  ) { }


  createPolicy(payload: any) {
    return this.http.post(this.BASE_URL+'/policy',payload,{'headers': headers})
  }

  editPolicy(payload: any,policyId:number) {
    return this.http.put(this.BASE_URL+'/policy/'+policyId,payload,{'headers': headers})
  }

  fetchPolicies(pageNumber:number,pageSize: number){
    let pageParams = new HttpParams()
    .append("pageNumber",pageNumber)
    .append("pageSize",pageSize)
    return this.http.get(this.BASE_URL+'/policy',{ 'headers': headers , params:pageParams  })
  }

  searchPolicy(payload: any){
    return this.http.post(this.BASE_URL+'/policy/search',payload,{'headers': headers})
  }

  deletePolicy(policyId:number){
    return this.http.delete(this.BASE_URL+'/policy/'+policyId,{'headers': headers})
  }


  fetchPolicy(policyId:any){
    return this.http.get(this.BASE_URL+'/policy/'+policyId,{'headers': headers})
  }

}
