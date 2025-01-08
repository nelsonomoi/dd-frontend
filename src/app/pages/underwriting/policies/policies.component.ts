import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { PolicyService } from './policy.service';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzDrawerModule, NzDrawerService } from 'ng-zorro-antd/drawer';
import { SearchPolicyComponent } from './search-policy/search-policy.component';
import { NzNotificationService } from 'ng-zorro-antd/notification';


@Component({
  selector: 'app-policies',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NzTableModule, NzCardModule, NzPageHeaderModule, NzDescriptionsModule, NzSpaceModule,
    NzButtonModule, NzIconModule, NzBadgeModule, NzMenuModule, NzDropDownModule, NzInputModule, NzPaginationModule, NzDrawerModule],
  templateUrl: './policies.component.html',
  styleUrl: './policies.component.css'
})
export class PoliciesComponent implements OnInit {

  searchForm: any = {};

  policiesData: any[] = []
  totalPolicyRecords: number = 0;

  isLoading: boolean = false

  pageNumber: number = environment.DEFAULT_PAGE_NUMBER
  pageSize: number = environment.DEFAULT_PAGE_SIZE


  constructor(
    private policyService: PolicyService,
    private drawerService: NzDrawerService,
    private notification: NzNotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadAllPolicies()
  }

  loadAllPolicies() {
    this.policyService.fetchPolicies(this.pageNumber, this.pageSize).subscribe({
      next: (resp: any) => {
        this.policiesData = resp.payload.data
        this.totalPolicyRecords = resp.payload?.totalElements
      }
    })
  }

  onPageChange(pageNumber: any) {
    this.pageNumber = pageNumber - 1
    this.loadAllPolicies()

  }

  onPageSizeChange(pageSize: any) {
    this.pageSize = pageSize
    this.loadAllPolicies()
  }

  onSearchUserByName() {

    if (this.searchForm.searchName?.length > 0) {
      let payload = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        policyHolder: this.searchForm.searchName
      }

      this.isLoading = true

      this.policyService.searchPolicy(payload).subscribe({
        next: (resp: any) => {
          this.isLoading = false;
          this.policiesData = resp.payload?.data
          this.totalPolicyRecords = resp.payload?.totalElements
        }
      })
    }

  }

  onSearchNameChange() {
    if (this.searchForm.searchName?.length == 0) {
      this.loadAllPolicies()
    }
  }

  editPolicy(data:any) {
    this.router.navigate(['/uw/policy/create'],{ queryParams: { action: 'edit' , policyId: data.id} })
  }


  deletePolicy(policyId: number) {
    if (policyId != null) {

      this.policyService.deletePolicy(policyId).subscribe({
        next: (resp: any) => {
          if (resp?.status == 'SUCCESS') {
            this.loadAllPolicies()
            this.notification.create(
              'success',
              'Success',
              resp?.message
            );

          } else {
            this.notification.create(
              'success',
              'Success',
              resp?.message
            );
          }
        }
      })

    }

  }


  openSearchComponent() {
    const drawerRef = this.drawerService.create<SearchPolicyComponent, { value: any }, string>({
      nzTitle: 'More Filters',
      nzContent: SearchPolicyComponent,
      nzContentParams: {
        value: {
          object: 'POLICY'
        }
      },
      nzWidth: "40%"
    });

    drawerRef.afterOpen.subscribe(() => {
      console.log('Drawer(Component) open');
    });

    drawerRef.afterClose.subscribe((data: any) => {
      console.log(data);
      if (typeof data === 'string') {

      }
    });

  }

}
