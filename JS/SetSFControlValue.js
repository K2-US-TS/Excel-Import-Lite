function SetControlValue(control, value) {
    $(document).ready(function () {
        var windowToUse = window;
        var dataLabelControlPath = "Controllers/Controller/Controls/Control[@Name='" + control + "']";
        if (!checkExists(windowToUse.viewControllerDefinition)) {
            windowToUse.viewControllerDefinition = $xml(windowToUse.__runtimeControllersDefinition);
        }
        var dataLabelControl = windowToUse.$sn(windowToUse.viewControllerDefinition, dataLabelControlPath);
        var controlInfoObj = new windowToUse.PopulateObject(null, value, dataLabelControl.getAttribute("ID"));
        windowToUse.executeControlFunction(dataLabelControl, "SetValue", controlInfoObj);
       /* Uncomment code below to fire change event */
       /* windowToUse.raiseEvent(myTextBoxControl.getAttribute("ID"), "Control", "OnChange"); */
    });
}              

/*
Here’s how you call it in the main function:
SetControlValue('Control name', ‘New Value’);

One thing to note is that this change does not explicitly fire the OnChange rule, so if you expect this control to fire another rule when changed, you will also need to execute this after setting its value:
windowToUse.raiseEvent(myTextBoxControl.getAttribute("ID"), "Control", "OnChange");

*/
