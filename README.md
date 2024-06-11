# slider-control
A slider control that can be used as a volume slider or anything else

![slider control](http://tudormoldovan.eu/git-assets/slider.png)

- selector - css dom element selector string / dom object
- setValue - value to set on init
- onChange - fn to call on change

HTML:
<code>
&lt;div class="slider volume">
    &lt;span class="current"></span&gt;
    &lt;span class="bg"></span&gt;
    &lt;div class="knob"></div&gt;
</div&gt;

JS:
volumeSlider = new RangeInput({
  selector : '.slider.volume',
  onChange : function (value, domElement) { },
  setValue : 75
})
</code>
