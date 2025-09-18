HA$PBExportHeader$main.sra
$PBExportComments$Generated Application Object
forward
global type main from application
end type
global transaction sqlca
global dynamicdescriptionarea sqlda
global dynamicstagingarea sqlsa
global error error
global message message
end forward

global type main from application
string appname = "main"
end type
global main main

forward prototypes
public function integer function_public ()
private function integer function_private ()
protected function integer function_protected ()
public subroutine function_subroutine ()
public function string function_with_parm (long al_value, ref long al_ref, readonly long al_readonly)
end prototypes

public function integer function_public ();
Return 1
end function

private function integer function_private ();
Return 1
end function

protected function integer function_protected ();
Return 1
end function

public subroutine function_subroutine ();
Return
end subroutine

public function string function_with_parm (long al_value, ref long al_ref, readonly long al_readonly);
Return ''
end function

on main.create
appname="main"
message=create message
sqlca=create transaction
sqlda=create dynamicdescriptionarea
sqlsa=create dynamicstagingarea
error=create error
end on

on main.destroy
destroy(sqlca)
destroy(sqlda)
destroy(sqlsa)
destroy(error)
destroy(message)
end on

event open;
MessageBox('', 'Open')
end event

