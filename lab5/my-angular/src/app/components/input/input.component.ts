import {Component, Input} from '@angular/core';

import {AbstractValueAccessor, MakeProvider} from "./abstractValueAcessor";

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
  providers: [MakeProvider(InputComponent)]
})
export class InputComponent extends AbstractValueAccessor{
  @Input() name: string;
  @Input() typeVal: string;
  @Input() placeholder: string;
}
