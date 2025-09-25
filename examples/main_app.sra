HA$PBExportHeader$main_app.sra
$PBExportComments$Generated Application Object
forward
global type main_app from application
end type
type local_st_test from structure within main_app
end type
type ds_non_visual_object from n_ds within main_app
end type
global transaction sqlca
global dynamicdescriptionarea sqlda
global dynamicstagingarea sqlsa
global error error
global message message
end forward

type local_st_test from structure
	string		test
	string		test
	string		test
end type

shared variables

Integer si_MySharedIntegerVar = 0
end variables

global variables

Integer gi_MyGlobalIntegerVar = 0, teste = 1, op_teste
end variables

global type main_app from application
string appname = "main_app"
event ue_custom_event_no_return_no_parm ( )
event ue_custom_event_no_return_parm ( ref integer ai_value,  ref integer ai_ref,  readonly integer ai_readonly )
event type integer ue_custom_event_return ( )
event ue_custom_event_throws ( ) throws exception
event ue_event_id_activate pbm_activate
ds_non_visual_object ds_non_visual_object
end type
global main_app main_app

type variables
	Private:
		String teste, teste1  = '0'
	Private Integer ii_MyInstanceIntegerVar = 0
end variables

forward prototypes
public function boolean postevent (string e)
public subroutine of_object_function_no_return ()
public function integer of_object_function_return () throws exception,excep_test
end prototypes

event ue_custom_event_no_return_no_parm();
boolean a
a = 1=1
return 
end event

event ue_custom_event_no_return_parm;
return 
end event

event type integer ue_custom_event_return();
return 1
end event

event ue_custom_event_throws();
Exception le_NewException

le_NewException = Create Exception
le_NewException.SetMessage('Custom New Exception')

Throw le_NewException
end event

event ue_event_id_activate;
return 1
end event

public function boolean postevent (string e);
return true
end function

public subroutine of_object_function_no_return ();
return
end subroutine

public function integer of_object_function_return () throws exception,excep_test;
return 1 
end function

on main_app.create
appname="main_app"
message=create message
sqlca=create transaction
sqlda=create dynamicdescriptionarea
sqlsa=create dynamicstagingarea
error=create error
this.ds_non_visual_object=create ds_non_visual_object
end on

on main_app.destroy
destroy(sqlca)
destroy(sqlda)
destroy(sqlsa)
destroy(error)
destroy(message)
destroy(this.ds_non_visual_object)
end on

event open;
MessageBox('', 'pb105 and vscode an shit')
end event

type ds_non_visual_object from n_ds within main_app descriptor "pb_nvo" = "true" 
event type long ue_object_component_custom_event ( integer ai_value ) throws exception
integer ii_dsinstancevar = 2
end type

event type long ue_object_component_custom_event(integer ai_value);
return 1
end event

event constructor;
MessageBox('', '')
end event

on ds_non_visual_object.create
call super::create
end on

on ds_non_visual_object.destroy
call super::destroy
end on

