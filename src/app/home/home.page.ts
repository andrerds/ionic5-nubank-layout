import { Component, Renderer2, ViewChild } from '@angular/core';
import { AnimationController, Animation, Platform, Gesture, GestureController, GestureDetail } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @ViewChild('blocks') blocks: any;
  @ViewChild('background') background: any;
  @ViewChild('swipeDown') swipeDown: any;
  public options: Array<any> = [
    { icon: 'person-add-outline', text: 'Indicar amigos' },
    { icon: 'phone-portrait-outline', text: 'Recarga de celular' },
    { icon: 'wallet-outline', text: 'Depositar' },
    { icon: 'options-outline', text: 'Ajustar limite' },
    { icon: 'help-circle-outline', text: 'Me ajuda' },
    { icon: 'barcode-outline', text: 'Pagar' },
    { icon: 'lock-open-outline', text: 'Bloquear cartão' },
    { icon: 'card-outline', text: 'Cartão virtual' },
  ]

  public slideOpts: any = { slidesPerView: 3, freeMode: true };

  public items: Array<any> = [
    { icon: 'help-circle-outline', text: 'Me ajuda' },
    { icon: 'person-outline', text: 'Perfil' },
    { icon: 'cash-outline', text: 'Configurar conta' },
    { icon: 'card-outline', text: 'Configurar cartão' },
    { icon: 'phone-portrait-outline', text: 'Configurações do app' }
  ]

  public initialStep: number = 0;
  private maxTraslate: number;
  private animation: Animation;
  private gesture: Gesture;
  public swiping: boolean = false;


  constructor(
    private animationCtrl: AnimationController,
    private platform: Platform,
    private renderer: Renderer2,
    private gestureCtrl: GestureController
  ) {
    this.maxTraslate = this.platform.height() - 200;
  }

  ngAfterViewInit() { // Carrega depois que a Dom ja estiver carregado
    this.createAnimation();
    this.detectSwipe();
  }

  detectSwipe(){
    this.gesture = this.gestureCtrl.create({
      el: this.swipeDown.el,
      gestureName: 'swipe-down',
      threshold:0,
      onMove: ev => this.onMove(ev),
      onEnd: env => this.onEnd(env)
    }, true);
    this.gesture.enable(true)
  }

  onMove(ev: GestureDetail){
   if(!this.swiping){
     this.animation.direction('normal').progressStart(true);
     this.swiping = true;
   }
   const setp: number = this.getStep(ev);
   
   this.animation.progressStep(setp);
   this.setBackgroundOpacity(setp);

  }

  onEnd(ev: GestureDetail){
    if(!this.swiping) return;
    this.gesture.enable(false);
    const step: number = this.getStep(ev);
    const shoudCompleted: boolean = step > 0.5;
    
    this.animation.progressEnd(shoudCompleted ? 1 : 0, step);
    
    this.initialStep = shoudCompleted ? this.maxTraslate : 0;

    this.setBackgroundOpacity();
    
    this.swiping = false;

  }


  getStep(ev: GestureDetail): number {
    const delta: number = this.initialStep + ev.deltaY;

    return delta / this.maxTraslate;
  }

  toogleBlocks() {
    this.initialStep = this.initialStep === 0 ? this.maxTraslate : 0;

    this.gesture.enable(false);

    this.animation.direction(this.initialStep === 0 ? 'reverse' : 'normal').play();
    // Direction se initial for igual a zero, entao reserve, se nao fica normal

    this.setBackgroundOpacity();

  }

  createAnimation() {
    this.animation = this.animationCtrl.create()
      .addElement(this.blocks.nativeElement) 
      /* // Pega o elemano referenciado na tag html usando ViewChild #blocks o nativeElement 
      e uma propriedade dentro do blocks*/
      .duration(300)
      .fromTo('transform', 'translateY(0)', `translateY(${this.maxTraslate}px)`)
      .onFinish(() => this.gesture.enable(true));
  }

  setBackgroundOpacity(value: number = null){
    /* 
    o Renderer trabalha com a mundaça do dom, então o logica baixo é
    pegar o elemento background.nativeElemete, pegar o opacity, setar para 0 
    caso o initialStep for igual a 0 caso contrario setar para 1
    */
    this.renderer.setStyle(this.background.nativeElement,'opacity', value ? value : this.initialStep === 0 ? '0' : '1');
  }
  fixedBlocks(): boolean {
    return this.swiping || this.initialStep === this.maxTraslate;
  }
  

}
