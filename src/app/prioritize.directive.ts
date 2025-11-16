import { Directive, ElementRef, Input, Renderer2, OnChanges } from '@angular/core';

@Directive({
  selector: '[priorityColor]',
  standalone: true
})
export class PrioritizeDirective implements OnChanges {
@Input() priorityColor!: 'low' | 'medium' | 'high';

constructor(private el: ElementRef, private renderer: Renderer2) {}

ngOnChanges(): void {
  this.updateColor();
}
updateColor() {
  const tds: NodeListOf<HTMLElement> = this.el.nativeElement.querySelectorAll('td');

  tds.forEach(td => {
  this.renderer.removeClass(td, 'table-danger');
  this.renderer.removeClass(td, 'table-warning');
  this.renderer.removeClass(td, 'table-info');

  switch (this.priorityColor) {
    case 'high':
      this.renderer.addClass(td, 'table-danger');
          break;
        case 'medium':
          this.renderer.addClass(td, 'table-warning');
          break;
        case 'low':
          this.renderer.addClass(td, 'table-info');
          break;
      }
    });
  }
}
