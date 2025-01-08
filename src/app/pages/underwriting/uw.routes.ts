import { Routes } from "@angular/router";
import { PoliciesComponent } from "./policies/policies.component";
import { CreatePolicyComponent } from "./policies/create-policy/create-policy.component";



export const UW_ROUTES: Routes = [
    {

        path: '',pathMatch: 'full', redirectTo: 'policies'
    },

    {
        path: 'policies' , component: PoliciesComponent
    },
    {
        path: 'policy/create',component: CreatePolicyComponent
    }
  
];