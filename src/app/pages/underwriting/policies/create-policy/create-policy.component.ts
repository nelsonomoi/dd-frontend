import { Component, Input, OnInit } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { PolicyService } from '../policy.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { differenceInCalendarDays } from 'date-fns';


@Component({
  selector: 'app-create-policy',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, NzPageHeaderModule, NzDescriptionsModule, NzButtonModule,
     NzCardModule, NzBreadCrumbModule, NzFormModule, NzInputModule, NzSelectModule,NzDatePickerModule,NzIconModule],
  templateUrl: './create-policy.component.html',
  styleUrl: './create-policy.component.css'
})
export class CreatePolicyComponent implements OnInit{

  createPolicyForm !: UntypedFormGroup

  action: string = 'create'

  policyId: any;
  policyData: any ;


  loading: boolean = false

  selectedMarker: string = "ANNUAL"

  coverDays: number = 365;


  constructor(
    private fb: UntypedFormBuilder,
    private policyService: PolicyService,
    private notification: NzNotificationService,
    private router: Router,
    private route: ActivatedRoute
  ){}

  ngOnInit(): void {


    this.route.queryParams.subscribe(params => {
      this.action = params['action']; 
      this.policyId = params['policyId']

      if (this.action == 'edit') {
        console.log("fetching policy details");
        this.fetchPolicyDetails(this.policyId)
      }
     
    });

    this.createPolicyForm = this.fb.group({
      client: [this.policyData?.policyHolder, [Validators.required]],
      branch: [this.policyData?.branch, [Validators.required]],
      policy: [this.policyData?.policyClass, [Validators.required]],
      agent: [this.policyData?.agent, [Validators.required]],
      astmarker: [this.policyData?.marker,[Validators.required]],
      startDate: [this.policyData?.periodFrom, [Validators.required]],
      endDate: [this.policyData?.periodTo, [Validators.required]],
      insuredAmount: [this.policyData?.insuredAmount, [Validators.required,Validators.min(0.1)]],
      annualPremium: [{value: this.policyData?.annualPremium, disabled: true}],
      endorseAmount: [{value: this.policyData?.endorseAmount, disabled: true}],
      comment: [this.policyData?.riskNote, [Validators.required]],
      rate: [this.policyData?.rate, [Validators.required,Validators.min(0.1)]]
    })

    this.setupValueChangeListener();
    
  }

  fetchPolicyDetails(policyId: any) {
     this.policyService.fetchPolicy(policyId).subscribe({
      next: (resp:any) => {
        if (resp?.status == 'SUCCESS') {
          this.policyData = resp.payload
          this.createPolicyForm = this.fb.group({
            client: [this.policyData?.policyHolder, [Validators.required]],
            branch: [this.policyData?.branch, [Validators.required]],
            policy: [this.policyData?.policyClass, [Validators.required]],
            agent: [this.policyData?.agent, [Validators.required]],
            astmarker: [this.policyData?.marker,[Validators.required]],
            startDate: [this.policyData?.periodFrom, [Validators.required]],
            endDate: [this.policyData?.periodTo, [Validators.required]],
            insuredAmount: [this.policyData?.insuredAmount, [Validators.required,Validators.min(0.1)]],
            annualPremium: [{value: this.policyData?.annualPremium, disabled: true}],
            endorseAmount: [{value: this.policyData?.endorseAmount, disabled: true}],
            comment: [this.policyData?.riskNote, [Validators.required]],
            rate: [this.policyData?.rate, [Validators.required,Validators.min(0.1)]]
          })
      
          this.setupValueChangeListener();
        }
      }
     })
  }



  onSubmit(){
    if (this.action == 'create') {
      this.createPolicy()
    }else{
      this.editPolicy()
    }
  }


  createPolicy(){

    if (this.createPolicyForm.valid) {

      this.loading = true 

      let payload = {
        'policyHolder': this.createPolicyForm.value.client,
        'policyClass': this.createPolicyForm.value.policy,
        'branch': this.createPolicyForm.value.branch,
        'agent': this.createPolicyForm.value.agent,
        'marker': this.createPolicyForm.value.astmarker,
        'periodFrom': this.createPolicyForm.value.startDate,
        'periodTo': this.createPolicyForm.value.endDate,
        'insuredAmount': this.createPolicyForm.value.insuredAmount,
        'annualPremium': this.createPolicyForm.getRawValue().annualPremium,
        'endorseAmount': this.createPolicyForm.getRawValue().endorseAmount,
        'riskNote': this.createPolicyForm.value.comment,
        'rate': this.createPolicyForm.value.rate,

      }

      this.policyService.createPolicy(payload).subscribe({
        next: (resp:any) => {
          this.loading = false

          if (resp?.status == 'SUCCESS') {

            this.router.navigate(["/uw/policies"])

            this.notification.create(
              'success',
              'Success',
              resp?.message
            );

            this.createPolicyForm.reset()


          }else{
            this.notification.create(
              'success',
              'Success',
              resp?.message
            );
          }

        },
        error: (error:any) => {
          this.loading = false
          this.notification.create(
            'success',
            'Success',
            error?.message
          );
        }

      })


      
    }else{
      Object.values(this.createPolicyForm.controls).forEach( control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      })
    }
  }

  editPolicy(){

    if (this.createPolicyForm.valid) {

      this.loading = true 

      let payload = {
        'policyHolder': this.createPolicyForm.value.client,
        'policyClass': this.createPolicyForm.value.policy,
        'branch': this.createPolicyForm.value.branch,
        'agent': this.createPolicyForm.value.agent,
        'marker': this.createPolicyForm.value.astmarker,
        'periodFrom': this.createPolicyForm.value.startDate,
        'periodTo': this.createPolicyForm.value.endDate,
        'insuredAmount': this.createPolicyForm.value.insuredAmount,
        'annualPremium': this.createPolicyForm.getRawValue().annualPremium,
        'endorseAmount': this.createPolicyForm.getRawValue().endorseAmount,
        'riskNote': this.createPolicyForm.value.comment,
        'rate': this.createPolicyForm.value.rate,

      }

      this.policyService.editPolicy(payload,this.policyData?.id).subscribe({
        next: (resp:any) => {
          this.loading = false

          if (resp?.status == 'SUCCESS') {

            this.router.navigate(["/uw/policies"])

            this.notification.create(
              'success',
              'Success',
              resp?.message
            );

            this.createPolicyForm.reset()


          }else{
            this.notification.create(
              'success',
              'Success',
              resp?.message
            );
          }

        },
        error: (error:any) => {
          this.loading = false
          this.notification.create(
            'success',
            'Success',
            error?.message
          );
        }

      })


      
    }else{
      Object.values(this.createPolicyForm.controls).forEach( control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      })
    }
  }

  private setupValueChangeListener(){
    this.createPolicyForm.get('insuredAmount')?.valueChanges.subscribe((value) => {
      this.computePremiums();
    });

    this.createPolicyForm.get('rate')?.valueChanges.subscribe((value) => {
      this.computePremiums(); 
    });

    this.createPolicyForm.get('startDate')?.valueChanges.subscribe((value) => {
      this.computePremiums()
    });

    this.createPolicyForm.get('endDate')?.valueChanges.subscribe((value) => {
      this.computePremiums()
    });


  }

  computePremiums() {
    let annualPremium: number = 0;
  
    annualPremium =
      this.createPolicyForm.get('insuredAmount')?.value *
      this.createPolicyForm.get('rate')?.value *
      0.01;
  
    // Set the annual premium with 2 decimal places
    this.createPolicyForm.get('annualPremium')?.setValue(
      annualPremium.toFixed(2),
      { emitEvent: false }
    );
  
    if (this.createPolicyForm.get('astmarker')?.value === 'ANNUAL') {
      // Directly set the annual premium as endorse amount
      this.createPolicyForm.get('endorseAmount')?.setValue(
        annualPremium.toFixed(2),
        { emitEvent: false }
      );
    } else {
      const startDate = this.createPolicyForm.get('startDate')?.value;
      const endDate = this.createPolicyForm.get('endDate')?.value;
  
      // Calculate cover days
      if (startDate && endDate) {
        this.coverDays = differenceInCalendarDays(
          new Date(endDate),
          new Date(startDate)
        );
  
        // Calculate endorse amount
        const endorseAmount =
          (annualPremium * this.coverDays) / 365;
  
        // Set the endorse amount with 2 decimal places
        this.createPolicyForm.get('endorseAmount')?.setValue(
          endorseAmount.toFixed(2),
          { emitEvent: false }
        );
      }
    }
  }
  

}
