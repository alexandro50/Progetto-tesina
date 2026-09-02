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
        return note;
    }

    public void setId(Long id) {
        this.id = id;
    }
    public void setUtenteId(Long utenteId) {
        this.utenteId = utenteId;
    }
    public void setInizioOrario(LocalDateTime inizioOrario) {
        this.inizioOrario = inizioOrario;
    }
    public void setFineOrario(LocalDateTime fineOrario) {
        this.fineOrario = fineOrario;
    }
    public void setNote(String note) {
        this.note = note;
    }
}
