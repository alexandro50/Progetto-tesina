package com.example.spring.backend_utenti.dto;

import java.time.LocalDateTime;

public class TurnoDTO {
    private Long id;
    private Long utenteId;
    private LocalDateTime inizioOrario;
    private LocalDateTime fineOrario;
    private String note;

    public Long getId() {
        return id;
    }
    public Long getUtenteId() {
        return utenteId;
    }
    public LocalDateTime getInizioOrario() {
        return inizioOrario;
    }
    public LocalDateTime getFineOrario() {
        return fineOrario;
    }
    public String getNote() {
        return note;}
        

}
