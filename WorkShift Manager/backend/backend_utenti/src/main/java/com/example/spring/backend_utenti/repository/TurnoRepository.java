package com.example.spring.backend_utenti.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.spring.backend_utenti.model.Turno;

public interface TurnoRepository extends JpaRepository<Turno, Long> {
    List<Turno> findByUtenteId(Long utenteId);

    @Query("SELECT CASE WHEN COUNT(t) > 0 THEN true ELSE false END " +
           "FROM Turno t WHERE t.utente.id = :utenteId " +
           "AND t.inizioOrario < :fineOrario AND t.fineOrario > :inizioOrario")
    boolean existsTurnoSovrapposto(
            @Param("utenteId") Long utenteId,
            @Param("inizioOrario") LocalDateTime inizioOrario,
            @Param("fineOrario") LocalDateTime fineOrario);

    @Query("SELECT t FROM Turno t WHERE t.utente.id = :utenteId AND t.note = :nota " +
           "ORDER BY t.inizioOrario DESC")
    List<Turno> findByUtenteIdAndNota(@Param("utenteId") Long utenteId, @Param("nota") String nota);
}
