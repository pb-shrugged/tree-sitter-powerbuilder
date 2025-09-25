HA$PBExportHeader$n_object.sru
forward
global type n_object from nonvisualobject
end type
type st_object_st from structure within n_object
end type
type my_n_ds from n_ds within n_object
end type
end forward

type st_object_st from structure
	string		label
end type

global type n_object from nonvisualobject autoinstantiate
event my_event ( )
my_n_ds my_n_ds
end type

type variables

public string variable
end variables

forward prototypes
public function integer my_function ()
end prototypes

event my_event();
return 
end event

public function integer my_function ();
return 1
end function

event constructor;
messageBox('', 'obj vscode')
end event

on n_object.create
call super::create
this.my_n_ds=create my_n_ds
TriggerEvent( this, "constructor" )
end on

on n_object.destroy
TriggerEvent( this, "destructor" )
call super::destroy
destroy(this.my_n_ds)
end on

type my_n_ds from n_ds within n_object descriptor "pb_nvo" = "true" 
end type

on my_n_ds.create
call super::create
end on

on my_n_ds.destroy
call super::destroy
end on

